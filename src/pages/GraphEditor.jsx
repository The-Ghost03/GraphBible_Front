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
import { ArrowLeft, Save, Library, PlusCircle, Menu, X } from "lucide-react";
import api from "../services/api";

export default function GraphEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphDetails, setGraphDetails] = useState(null);

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [verseStart, setVerseStart] = useState("1");
  const [verseEnd, setVerseEnd] = useState("1");
  const [loading, setLoading] = useState(false);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // --- NOUVEAUX ÉTATS POUR LE MOBILE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Détecter si on est sur mobile quand on redimensionne l'écran
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 1. Charger le nom du graphe (Factice pour l'instant)
    setGraphDetails({ title: `Étude Biblique` });

    // 2. Charger les noeuds et liens existants depuis Neo4j
    api
      .get(`/graphs/${id}/data`)
      .then((res) => {
        if (res.data.nodes.length > 0) setNodes(res.data.nodes);
        if (res.data.edges.length > 0) setEdges(res.data.edges);
      })
      .catch((err) =>
        console.error("Erreur chargement des données du graphe:", err),
      );

    // 3. Charger la liste des livres pour la sidebar
    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.books);
        if (res.data.books.length > 0) setSelectedBook(res.data.books[0].name);
      })
      .catch((err) => console.error("Erreur chargement livres:", err));
  }, [id, setNodes, setEdges]);

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

      // Fermer la sidebar automatiquement sur mobile après un ajout
      if (isMobile) setIsSidebarOpen(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur : Passage introuvable !");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // On envoie l'état exact de tes noeuds et liens à l'API
      await api.post(`/graphs/${id}/save`, { nodes, edges });
      alert("✅ Graphe sauvegardé avec succès !"); // Plus tard, on remplacera ça par un joli Toast
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la sauvegarde.");
    }
  };
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
            {/* Bouton Hamburger (Visible uniquement sur mobile) */}
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
            <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate max-w-[150px] md:max-w-xs">
              {graphDetails?.title || "Chargement..."}
            </h1>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-slate-800 text-white font-semibold px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-slate-900 transition shadow-md text-sm md:text-base"
          >
            <Save size={18} className="hidden sm:block" /> Sauvegarder
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Overlay sombre pour mobile quand le menu est ouvert */}
          {isMobile && isSidebarOpen && (
            <div
              className="absolute inset-0 bg-slate-900/50 z-30 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Panneau latéral : Bibliothèque (Responsive) */}
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
              {/* Bouton pour fermer sur mobile */}
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
                className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 md:py-4 rounded-lg hover:bg-blue-700 transition shadow-md active:scale-95"
              >
                <PlusCircle size={18} />{" "}
                {loading ? "Ajout..." : "Ajouter au Tableau"}
              </button>
            </div>
          </div>

          {/* Zone du Graphe */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              fitView
              // Optimisations Mobile React Flow (désactive certaines interactions parasites)
              panOnScroll={true}
              zoomOnDoubleClick={!isMobile}
            >
              <Controls className="mb-4" />
              {!isMobile && (
                <MiniMap
                  nodeColor={(n) => "#3b82f6"}
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
    </ReactFlowProvider>
  );
}
