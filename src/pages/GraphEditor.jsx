import { useState, useCallback, useEffect, useRef, useMemo } from "react";
// 🚀 N'OUBLIE PAS L'IMPORT DE useNavigate !
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  getNodesBounds,
  getViewportForBounds,
} from "reactflow";
import "reactflow/dist/style.css";
import toast from "react-hot-toast";
import api from "@/services/api";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

import EditorTopbar from "@/features/graphs/components/EditorTopbar";
import EditorSidebar from "@/features/graphs/components/EditorSidebar";
import NoteNode from "@/features/graphs/components/NoteNode";
import PassageNode from "@/features/graphs/components/PassageNode";
import CustomEdge from "@/features/graphs/components/CustomEdge";
import StudySheet from "@/features/graphs/components/StudySheet";

export default function GraphEditor() {
  const { id } = useParams();
  const navigate = useNavigate(); // 🚀 DÉCLARATION DU NAVIGATEUR

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isStudySheetOpen, setIsStudySheetOpen] = useState(false);

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
    let isMounted = true;
    api
      .get(`/graphs/${id}/data`)
      .then((res) => {
        if (!isMounted) return;
        setGraphDetails(res.data.graph);
        if (res.data.nodes?.length > 0) setNodes(res.data.nodes);
        if (res.data.edges?.length > 0) {
          setEdges(
            res.data.edges.map((edge) => ({
              ...edge,
              type: "custom",
              data: edge.data || { isDashed: false },
            })),
          );
        }
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 1000);
      })
      .catch((err) => {
        if (isMounted) toast.error("Impossible de charger le graphe.");
      });

    api
      .get("/books")
      .then((res) => {
        if (!isMounted) return;
        setBooks(res.data.books);
        if (res.data.books.length > 0) setSelectedBook(res.data.books[0].name);
      })
      .finally(() => {
        if (isMounted) setIsBooksLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, setNodes, setEdges]);

  // SAUVEGARDE DU GRAPHE (Uniquement les positions)
  const saveCanvas = useCallback(
    async (currentNodes, currentEdges) => {
      if (isInitialLoad.current) return;
      setIsSaving(true);
      try {
        await api.post(`/graphs/${id}/save`, {
          nodes: currentNodes,
          edges: currentEdges,
        });
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
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveCanvas(nodes, edges);
    }, 2000);
    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, [nodes, edges, saveCanvas]);

  // 🚀 NOUVEAU : SAUVEGARDE DE LA VIGNETTE AU MOMENT DE QUITTER !
  const handleBackToDashboard = async () => {
    if (!reactFlowInstance) {
      navigate("/dashboard");
      return;
    }

    const toastId = toast.loading("Mise à jour de l'aperçu...");
    try {
      // On recadre vite fait le graphe pour tout voir
      reactFlowInstance.fitView({ padding: 0.2, duration: 0 });
      await new Promise((resolve) => setTimeout(resolve, 200));

      const flowElement = document.querySelector(".react-flow");
      const dataUrl = await toPng(flowElement, {
        filter: (node) =>
          !node.classList?.contains("react-flow__minimap") &&
          !node.classList?.contains("react-flow__controls"),
        pixelRatio: 1, // Basse qualité, c'est juste pour une miniature ! C'est super rapide.
        backgroundColor: "#f8fafc",
      });

      // On met à jour l'image
      await api.put(`/graphs/${id}/metadata`, { thumbnail: dataUrl });

      toast.dismiss(toastId);
      navigate("/dashboard");
    } catch (err) {
      // Même en cas d'erreur (si le graphe est vide par exemple), on retourne au Dashboard
      toast.dismiss(toastId);
      navigate("/dashboard");
    }
  };

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

  const handleStudySheetSave = useCallback(
    async (htmlContent) => {
      setGraphDetails((prev) => ({ ...prev, description: htmlContent }));
      setIsSaving(true);
      try {
        await api.put(`/graphs/${id}/metadata`, { description: htmlContent });
      } catch (err) {
        console.error("Study sheet auto-save failed");
      } finally {
        setIsSaving(false);
      }
    },
    [id],
  );

  const handleExport = async (format) => {
    // 1. Export Fiche d'étude
    if (format === "study-sheet") {
      const toastId = toast.loading("Génération du PDF...");
      try {
        const content =
          graphDetails?.description || "<p>Votre fiche d'étude est vide.</p>";

        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.top = "0";
        tempDiv.style.left = "0";
        tempDiv.style.width = "800px";
        tempDiv.style.background = "#ffffff";
        tempDiv.style.padding = "40px";
        tempDiv.style.zIndex = "-1000";

        tempDiv.innerHTML = `
          <div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
            <style>
              .export-body { line-height: 1.6; font-size: 16px; color: #1e293b; }
              .export-body h1 { font-size: 24px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #0f172a; }
              .export-body h2 { font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #1e293b; }
              .export-body h3 { font-size: 18px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; color: #334155; }
              .export-body p { margin-bottom: 16px; }
              .export-body ul { list-style-type: disc; margin-left: 24px; margin-bottom: 16px; }
              .export-body ol { list-style-type: decimal; margin-left: 24px; margin-bottom: 16px; }
              .export-body li { margin-bottom: 6px; display: list-item; }
              .export-body blockquote { border-left: 4px solid #cbd5e1; padding-left: 16px; font-style: italic; color: #475569; margin-bottom: 16px; }
              .export-header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 30px; }
              .export-header h1 { font-size: 32px; margin: 0; color: #0f172a; font-weight: 800; }
            </style>
            <div class="export-header">
              <h1>${graphDetails?.title || "Fiche d'étude"}</h1>
            </div>
            <div class="export-body">
              ${content}
            </div>
          </div>
        `;
        document.body.appendChild(tempDiv);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const dataUrl = await toPng(tempDiv, { pixelRatio: 2 });
        document.body.removeChild(tempDiv);

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const finalPdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [
            pdfWidth,
            Math.max(pdfHeight, pdf.internal.pageSize.getHeight()),
          ],
        });

        finalPdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

        const pdfBlob = finalPdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const newWindow = window.open(pdfUrl, "_blank");

        if (!newWindow) {
          finalPdf.save(`${graphDetails?.title || "Fiche_Etude"}.pdf`);
          toast.success("Pop-up bloqué, fichier téléchargé !", { id: toastId });
        } else {
          toast.success("PDF ouvert dans un nouvel onglet !", { id: toastId });
        }
      } catch (err) {
        toast.error("Échec de la génération.", { id: toastId });
      }
      return;
    }

    // 2. Export du Graphe Visuel
    if (!reactFlowInstance) return;
    const toastId = toast.loading("Calcul de la zone d'export...");

    try {
      const nodesBounds = getNodesBounds(reactFlowInstance.getNodes());
      const padding = 100;
      const exportWidth = nodesBounds.width + padding * 2;
      const exportHeight = nodesBounds.height + padding * 2;
      const viewport = getViewportForBounds(
        nodesBounds,
        exportWidth,
        exportHeight,
        0.5,
        2,
      );

      const viewportNode = document.querySelector(".react-flow__viewport");

      const dataUrl = await toPng(viewportNode, {
        backgroundColor: "#f8fafc",
        width: exportWidth,
        height: exportHeight,
        style: {
          width: `${exportWidth}px`,
          height: `${exportHeight}px`,
          transform: `translate(${viewport.x + padding}px, ${viewport.y + padding}px) scale(${viewport.zoom})`,
        },
      });

      api.put(`/graphs/${id}/metadata`, { thumbnail: dataUrl });

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${graphDetails?.title || "BibleGraph"}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [exportWidth, exportHeight],
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, exportWidth, exportHeight);
        pdf.save(`${graphDetails?.title || "BibleGraph"}.pdf`);
      }
      toast.success("Export réussi !", { id: toastId });
    } catch (err) {
      toast.error("Erreur lors de l'export.", { id: toastId });
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
          onTitleChange={handleTitleChange}
          onExport={handleExport}
          onBack={
            handleBackToDashboard
          } /* 🚀 APPEL DE LA FONCTION POUR QUITTER */
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
            onOpenStudySheet={() => {
              setIsStudySheetOpen(true);
              if (isMobile) setIsSidebarOpen(false);
            }}
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

        {isStudySheetOpen && (
          <StudySheet
            initialContent={graphDetails?.description}
            title={graphDetails?.title}
            onClose={() => setIsStudySheetOpen(false)}
            onSave={handleStudySheetSave}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
}
