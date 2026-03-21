import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ArrowLeft,
  Save,
  Library,
  PlusCircle,
  Menu,
  X,
  Loader2,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api"; // Utilisation de l'alias @ si configuré, sinon "../services/api"
import { BooksLoaderSkeleton } from "@/shared/components/Skeletons"; // Utilisation de l'alias @

export default function GraphEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  // États de la Modale des paramètres
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isUpdatingMeta, setIsUpdatingMeta] = useState(false);

  // États React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphDetails, setGraphDetails] = useState(null);

  // États Recherche Biblique
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [verseStart, setVerseStart] = useState("1");
  const [verseEnd, setVerseEnd] = useState("1");

  // États d'interface
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBooksLoading, setIsBooksLoading] = useState(true);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // États Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Écouteur de redimensionnement pour le Mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Chargement initial des données
  useEffect(() => {
    setGraphDetails({ title: `Chargement...` });

    // 1. Charger les data du graphe (Noeuds, Edges, Titre)
    api
      .get(`/graphs/${id}/data`)
      .then((res) => {
        setGraphDetails(res.data.graph);
        setEditTitle(res.data.graph.title);
        setEditDesc(res.data.graph.description || "");

        if (res.data.nodes && res.data.nodes.length > 0)
          setNodes(res.data.nodes);
        if (res.data.edges && res.data.edges.length > 0)
          setEdges(res.data.edges);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le graphe.");
      });

    // 2. Charger les livres de la Bible
    setIsBooksLoading(true);
    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.books);
        if (res.data.books.length > 0) setSelectedBook(res.data.books[0].name);
      })
      .catch((err) => console.error("Erreur chargement livres:", err))
      .finally(() => setIsBooksLoading(false));
  }, [id, setNodes, setEdges]);

  // Sauvegarder les métadonnées (Titre/Desc)
  const handleUpdateMetadata = async (e) => {
    e.preventDefault();
    if (!editTitle) return;

    setIsUpdatingMeta(true);
    const toastId = toast.loading("Mise à jour...");
    try {
      await api.put(`/graphs/${id}/metadata`, {
        title: editTitle,
        description: editDesc,
        is_public: false,
      });
      setGraphDetails({ title: editTitle, description: editDesc });
      setIsSettingsModalOpen(false);
      toast.success("Informations mises à jour !", { id: toastId });
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.", { id: toastId });
    } finally {
      setIsUpdatingMeta(false);
    }
  };

  // Sauvegarder le Canva (Noeuds/Edges)
  const handleSave = async () => {
    if (nodes.length === 0 && edges.length === 0) {
      toast.error("Le graphe est vide, rien à sauvegarder.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Sauvegarde de ton travail...");

    try {
      await api.post(`/graphs/${id}/save`, { nodes, edges });
      toast.success("C'est bon ! Tes modifications sont enregistrées.", {
        id: toastId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Impossible de sauvegarder sur le serveur.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // Ajouter un passage biblique au Canva
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
        x: window.innerWidth / 2 - (isMobile ? 150 : 200),
        y: window.innerHeight / 2 - 100,
      });

      const newNode = {
        id: `passage-${Date.now()}`,
        type: "default",
        position: center,
        data: { label: `📖 ${reference}\n${text}` },
        style: {
          background: "#ffffff",
          color: "#1e293b",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          padding: "15px",
          fontWeight: "500",
          textAlign: "center",
          minWidth: 280,
          maxWidth: isMobile ? 300 : 400,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          whiteSpace: "pre-wrap",
          fontSize: isMobile ? "14px" : "16px",
        },
      };

      setNodes((nds) => [...nds, newNode]);
      if (isMobile) setIsSidebarOpen(false); // Fermer le menu sur mobile
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Erreur : Passage introuvable !",
      );
    } finally {
      setLoading(false);
    }
  };

  // Connecter deux noeuds manuellement
  const onConnect = useCallback(
    (params) => {
      const edgeParams = {
        ...params,
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edgeParams, eds));
    },
    [setEdges],
  );

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans relative">
        {/* Barre supérieure */}
        <div className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-6 z-20 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Titre et Bouton Paramètres */}
            <div className="flex items-center gap-2">
              <h1
                className="text-lg md:text-xl font-bold text-slate-800 truncate max-w-[150px] md:max-w-xs"
                title={graphDetails?.title}
              >
                {graphDetails?.title || "Chargement..."}
              </h1>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                title="Paramètres de l'étude"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Bouton Sauvegarder */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-slate-800 text-white font-semibold px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-slate-900 transition shadow-md text-sm md:text-base disabled:bg-slate-500 active:scale-95 transition-transform"
          >
            {isSaving ? (
              <Loader2 className="animate-spin hidden sm:block" size={18} />
            ) : (
              <Save size={18} className="hidden sm:block" />
            )}
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Overlay Mobile */}
          {isMobile && isSidebarOpen && (
            <div
              className="absolute inset-0 bg-slate-900/50 z-30 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Panneau latéral (Sidebar) */}
          <div
            className={`
            absolute md:relative z-40 h-full bg-white shadow-2xl md:shadow-lg border-r border-slate-200 w-80 flex flex-col gap-6
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
          `}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Library className="text-blue-500" /> Ajouter un Passage
              </h2>
              <button
                className="md:hidden p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 overflow-y-auto">
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Livre :
                </label>
                {isBooksLoading ? (
                  <BooksLoaderSkeleton />
                ) : (
                  <select
                    className="mt-1 w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-base"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                  >
                    {books.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Chapitre :
                </label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-base"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-600">
                    De (Verset) :
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-center font-bold text-blue-700 text-base"
                    value={verseStart}
                    onChange={(e) => setVerseStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">
                    À (Verset) :
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-center font-bold text-blue-700 text-base"
                    value={verseEnd}
                    onChange={(e) => setVerseEnd(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleAddSpecificPassage}
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 md:py-4 rounded-lg hover:bg-blue-700 transition shadow-md active:scale-95 transition-transform"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <PlusCircle size={18} />
                )}{" "}
                {loading ? "Ajout..." : "Ajouter au Tableau"}
              </button>
            </div>
          </div>

          {/* Zone du Graphe React Flow */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              fitView
              panOnScroll={true}
              zoomOnDoubleClick={!isMobile}
            >
              <Controls className="mb-4" />
              {!isMobile && (
                <MiniMap
                  nodeColor={() => "#3b82f6"}
                  maskColor="rgba(240, 249, 255, 0.7)"
                />
              )}
              <Background
                variant="dots"
                gap={isMobile ? 15 : 20}
                size={2}
                color="#94a3b8"
              />
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* MODALE DE PARAMÈTRES DU GRAPHE */}
      {isSettingsModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Paramètres de l'étude
              </h2>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateMetadata}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Titre de l'étude
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingMeta}
                  className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md disabled:bg-blue-400"
                >
                  {isUpdatingMeta ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ReactFlowProvider>
  );
}
