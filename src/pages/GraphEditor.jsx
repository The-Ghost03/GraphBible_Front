import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import toast from "react-hot-toast";
import api from "@/services/api";
import { toPng } from "html-to-image"; // 🚀 NOUVEL IMPORT

import EditorTopbar from "@/features/graphs/components/EditorTopbar";
import EditorSidebar from "@/features/graphs/components/EditorSidebar";
import NoteNode from "@/features/graphs/components/NoteNode";
import PassageNode from "@/features/graphs/components/PassageNode";
import CustomEdge from "@/features/graphs/components/CustomEdge";

export default function GraphEditor() {
  const { id } = useParams();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphDetails, setGraphDetails] = useState(null);

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [verseStart, setVerseStart] = useState("1");
  const [verseEnd, setVerseEnd] = useState("1");

  const [isBooksLoading, setIsBooksLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isSaving, setIsSaving] = useState(false);
  const isInitialLoad = useRef(true);
  const autoSaveTimeoutRef = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodeTypes = useMemo(
    () => ({ note: NoteNode, passage: PassageNode }),
    [],
  );
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api
      .get(`/graphs/${id}/data`)
      .then((res) => {
        setGraphDetails(res.data.graph);
        if (res.data.nodes?.length > 0) setNodes(res.data.nodes);
        if (res.data.edges?.length > 0) {
          setEdges(
            res.data.edges.map((edge) => ({
              ...edge,
              type: "custom", // Indispensable pour garder les boutons X !
              data: edge.data || { isDashed: false },
            })),
          );
        }

        setTimeout(() => {
          isInitialLoad.current = false;
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le graphe.");
      });

    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.books);
        if (res.data.books.length > 0) setSelectedBook(res.data.books[0].name);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsBooksLoading(false));
  }, [id, setNodes, setEdges]);

  // 🚀 SAUVEGARDE ET CAPTURE DE VIGNETTE
  const saveCanvas = useCallback(
    async (currentNodes, currentEdges) => {
      if (isInitialLoad.current) return;
      setIsSaving(true);
      try {
        // 1. Sauvegarde les positions et les données
        await api.post(`/graphs/${id}/save`, {
          nodes: currentNodes,
          edges: currentEdges,
        });

        // 2. Capture "photographique" du graphe pour le Dashboard
        const flowElement = document.querySelector(".react-flow");
        if (flowElement) {
          const dataUrl = await toPng(flowElement, {
            filter: (node) =>
              !node.classList?.contains("react-flow__minimap") &&
              !node.classList?.contains("react-flow__controls"),
            quality: 0.5,
            backgroundColor: "#f8fafc",
          });

          // 3. Envoi silencieux de l'image
          await api.put(`/graphs/${id}/metadata`, { thumbnail: dataUrl });
        }
      } catch (err) {
        console.error("Auto-save failed", err);
      } finally {
        setIsSaving(false);
      }
    },
    [id],
  );

  useEffect(() => {
    if (isInitialLoad.current) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveCanvas(nodes, edges);
    }, 2000);

    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, [nodes, edges, saveCanvas]);

  const handleTitleChange = async (newTitle) => {
    if (!newTitle || newTitle === graphDetails?.title) return;
    setIsSaving(true);
    try {
      await api.put(`/graphs/${id}/metadata`, { title: newTitle });
      setGraphDetails((prev) => ({ ...prev, title: newTitle }));
    } catch (err) {
      toast.error("Erreur de renommage.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSpecificPassage = async () => {
    if (
      !selectedBook ||
      !selectedChapter ||
      !verseStart ||
      !verseEnd ||
      !reactFlowInstance
    )
      return;

    setLoading(true);
    try {
      const res = await api.get(
        `/nodes/fetch-passage/${selectedBook}/${selectedChapter}/${verseStart}/${verseEnd}`,
      );
      const { reference, text } = res.data;

      const center = reactFlowInstance.project({
        x: window.innerWidth / 2 - (isMobile ? 140 : 175),
        y: window.innerHeight / 2 - 100,
      });

      const newNode = {
        id: `passage-${Date.now()}`,
        type: "passage",
        position: center,
        data: { reference, text },
      };

      setNodes((nds) => [...nds, newNode]);
      if (isMobile) setIsSidebarOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Passage introuvable !");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!reactFlowInstance) return;
    const center = reactFlowInstance.project({
      x: window.innerWidth / 2 - 110,
      y: window.innerHeight / 2 - 50,
    });

    const newNote = {
      id: `note-${Date.now()}`,
      type: "note",
      position: center,
      data: { text: "", color: "yellow" },
    };

    setNodes((nds) => [...nds, newNote]);
    if (isMobile) setIsSidebarOpen(false);
  };

  // 🚀 MODIFICATION DES LIENS ICI (non animé, plus épais)
  const onConnect = useCallback(
    (params) => {
      const edgeParams = {
        ...params,
        type: "custom",
        animated: false,
        data: { isDashed: false },
        style: { stroke: "#64748b", strokeWidth: 3 },
      };
      setEdges((eds) => addEdge(edgeParams, eds));
    },
    [setEdges],
  );

  return (
    <ReactFlowProvider>
      <div className="fixed inset-0 flex flex-col bg-slate-50 overflow-hidden font-sans z-0">
        <EditorTopbar
          graphDetails={graphDetails}
          isSaving={isSaving}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onTitleChange={handleTitleChange}
        />

        <div className="flex-1 flex overflow-hidden w-full relative">
          <EditorSidebar
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            books={books}
            isBooksLoading={isBooksLoading}
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            verseStart={verseStart}
            setVerseStart={setVerseStart}
            verseEnd={verseEnd}
            setVerseEnd={setVerseEnd}
            loading={loading}
            onAddPassage={handleAddSpecificPassage}
            onAddNote={handleAddNote}
          />

          <div className="flex-1 h-full w-full relative z-0">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              fitView
              panOnScroll={true}
              zoomOnDoubleClick={!isMobile}
              deleteKeyCode={["Backspace", "Delete"]}
            >
              <Controls className="mb-4 shadow-sm border-slate-200 bg-white/90" />
              {!isMobile && (
                <MiniMap
                  nodeColor={(node) => {
                    if (node.type === "passage") return "#3b82f6";
                    if (node.type === "note") {
                      if (node.data.color === "pink") return "#f43f5e";
                      if (node.data.color === "blue") return "#0ea5e9";
                      if (node.data.color === "green") return "#10b981";
                      return "#f59e0b";
                    }
                    return "#cbd5e1";
                  }}
                  maskColor="rgba(240, 249, 255, 0.7)"
                  className="rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                />
              )}
              <Background
                variant="dots"
                gap={isMobile ? 15 : 20}
                size={2}
                color="#cbd5e1"
              />
            </ReactFlow>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
