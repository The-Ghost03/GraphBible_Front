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
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

import EditorTopbar from "@/features/graphs/components/EditorTopbar";
import EditorSidebar from "@/features/graphs/components/EditorSidebar";
import NoteNode from "@/features/graphs/components/NoteNode";
import PassageNode from "@/features/graphs/components/PassageNode";
import CustomEdge from "@/features/graphs/components/CustomEdge";

// 🚀 IMPORTS POUR L'ÉDITEUR COMPLET
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  X,
  FileText,
} from "lucide-react";

// --- 🚀 COMPOSANT DE LA FICHE D'ÉTUDE (Éditeur Complet) ---
const StudySheetOverlay = ({ initialContent, title, onClose, onSave }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content:
      initialContent ||
      "<h1>Réflexions sur cette étude...</h1><p>Commencez à rédiger ici.</p>",
    onUpdate: ({ editor }) => {
      onSave(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // 🚀 On FORCE le style CSS pour garantir que les listes à puces et numéros fonctionnent toujours
        class:
          "prose prose-slate max-w-none w-full h-full outline-none p-6 pb-20 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold",
      },
    },
  });

  return (
    <div className="absolute inset-0 z-40 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
      {/* HEADER DE LA FICHE */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Fiche d'étude
            </h2>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-md">
              {title}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-colors cursor-pointer shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      {/* BARRE D'OUTILS COMPLÈTE */}
      <div className="bg-white border-b border-slate-200 p-2 shrink-0 flex justify-center shadow-sm">
        {editor && (
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 max-w-4xl w-full">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("heading", { level: 1 }) ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Titre 1"
            >
              <Heading1 size={18} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("heading", { level: 2 }) ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Titre 2"
            >
              <Heading2 size={18} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("heading", { level: 3 }) ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Titre 3"
            >
              <Heading3 size={18} />
            </button>
            <div className="w-px h-6 bg-slate-300 mx-1"></div>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("bold") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("italic") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("strike") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
            >
              <Strikethrough size={18} />
            </button>
            <div className="w-px h-6 bg-slate-300 mx-1"></div>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("bulletList") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Liste à puces"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("orderedList") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Liste numérotée"
            >
              <ListOrdered size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("blockquote") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Citation"
            >
              <Quote size={18} />
            </button>
            <div className="hidden sm:block w-px h-6 bg-slate-300 mx-1"></div>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              className="hidden sm:block p-2 rounded hover:bg-slate-100 text-slate-600"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              className="hidden sm:block p-2 rounded hover:bg-slate-100 text-slate-600"
            >
              <Redo size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ZONE D'ÉDITION */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto w-full bg-white shadow-md border border-slate-200 rounded-xl min-h-full">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL (GRAPHE) ---
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isStudySheetOpen, setIsStudySheetOpen] = useState(false);
  const studySheetTimeoutRef = useRef(null);

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
        toast.error("Impossible de charger le graphe.");
      });

    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.books);
        if (res.data.books.length > 0) setSelectedBook(res.data.books[0].name);
      })
      .finally(() => setIsBooksLoading(false));
  }, [id, setNodes, setEdges]);

  // 🚀 SAUVEGARDE DU GRAPHE
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
        console.error("Auto-save failed");
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

  const handleTitleChange = async (newTitle) => {
    if (!newTitle || newTitle === graphDetails?.title) return;
    setIsSaving(true);
    try {
      await api.put(`/graphs/${id}/metadata`, { title: newTitle });
      setGraphDetails((prev) => ({ ...prev, title: newTitle }));
    } catch (err) {
      toast.error("Erreur.");
    } finally {
      setIsSaving(false);
    }
  };

  // 🚀 SAUVEGARDE AUTO DE LA FICHE D'ÉTUDE
  const handleStudySheetSave = useCallback(
    (htmlContent) => {
      setGraphDetails((prev) => ({ ...prev, description: htmlContent }));
      if (studySheetTimeoutRef.current)
        clearTimeout(studySheetTimeoutRef.current);
      studySheetTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await api.put(`/graphs/${id}/metadata`, { description: htmlContent });
        } catch (err) {
          console.error("Study sheet auto-save failed");
        } finally {
          setIsSaving(false);
        }
      }, 1500);
    },
    [id],
  );

  // 🚀 FONCTION D'EXPORT MULTIPLE (Téléchargement direct + Plus de rognage)
  const handleExport = async (format) => {
    // 1. TÉLÉCHARGEMENT PDF DE LA FICHE D'ÉTUDE (Technique du Div Caché)
    if (format === "study-sheet") {
      const toastId = toast.loading("Génération du PDF de la fiche...");
      try {
        const content =
          graphDetails?.description || "<p>Fiche d'étude vide.</p>";

        // On crée un composant caché parfait pour la capture
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        tempDiv.style.width = "800px"; // Largeur fixe pour avoir un beau rendu PDF
        tempDiv.style.background = "#ffffff";
        tempDiv.style.padding = "40px";

        // On injecte le style pour forcer le rendu des puces et numéros dans l'image
        tempDiv.innerHTML = `
          <style>
            body { font-family: system-ui, sans-serif; color: #0f172a; }
            h1 { font-size: 28px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold; }
            h2 { font-size: 22px; margin-top: 20px; font-weight: bold; }
            h3 { font-size: 18px; margin-top: 15px; font-weight: bold; }
            ul { list-style-type: disc !important; margin-left: 25px !important; margin-bottom: 15px !important; }
            ol { list-style-type: decimal !important; margin-left: 25px !important; margin-bottom: 15px !important; }
            li { margin-bottom: 5px; display: list-item; }
            blockquote { border-left: 4px solid #cbd5e1; padding-left: 15px; font-style: italic; color: #475569; }
            p { margin-bottom: 15px; line-height: 1.6; }
          </style>
          <h1>${graphDetails?.title || "Fiche d'étude"}</h1>
          <div>${content}</div>
        `;
        document.body.appendChild(tempDiv);

        // Capture de la div
        const dataUrl = await toPng(tempDiv, { pixelRatio: 2 });
        document.body.removeChild(tempDiv);

        // Intégration dans un PDF dynamique (s'allonge selon le contenu)
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // On crée un PDF final qui prend la taille exacte de l'image pour ne jamais couper le texte
        const finalPdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [
            pdfWidth,
            Math.max(pdfHeight, pdf.internal.pageSize.getHeight()),
          ],
        });

        finalPdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        finalPdf.save(`${graphDetails?.title || "Fiche_Etude"}.pdf`);
        toast.success("Téléchargement réussi !", { id: toastId });
      } catch (err) {
        toast.error("Échec de la génération.", { id: toastId });
      }
      return;
    }

    // 2. EXPORT DU GRAPHE VISUEL
    if (!reactFlowInstance) return;
    const toastId = toast.loading("Capture de l'espace de travail...");

    try {
      // 🚀 ASTUCE ANTI-ROGNAGE : On force le graphe à recadrer tous les éléments visiblement avant la capture
      reactFlowInstance.fitView({ padding: 0.2, duration: 0 });

      // On attend une fraction de seconde que le navigateur redessine l'écran
      await new Promise((resolve) => setTimeout(resolve, 200));

      const flowElement = document.querySelector(".react-flow");
      const dataUrl = await toPng(flowElement, {
        filter: (node) =>
          !node.classList?.contains("react-flow__minimap") &&
          !node.classList?.contains("react-flow__controls"),
        pixelRatio: 3, // Très haute qualité
        backgroundColor: "#f8fafc",
      });

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${graphDetails?.title || "Graphe"}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF({ orientation: "landscape" });
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${graphDetails?.title || "Graphe"}.pdf`);
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

        {/* 🚀 L'ÉDITEUR COMPLET (S'ouvre par-dessus sans quitter la page) */}
        {isStudySheetOpen && (
          <StudySheetOverlay
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
