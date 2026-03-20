import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeft, Save, Search, Library } from "lucide-react";
import api from "../api";

export default function GraphEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphDetails, setGraphDetails] = useState(null);

  // États pour la recherche biblique
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [loading, setLoading] = useState(false);

  // 1. Charger les infos du graphe ET la liste des livres au démarrage
  useEffect(() => {
    // Info factice du graphe pour le moment
    setGraphDetails({ title: `Étude biblique` });

    // Récupérer la vraie liste des livres depuis FastAPI
    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.books);
        if (res.data.books.length > 0) {
          setSelectedBook(res.data.books[0].name);
        }
      })
      .catch((err) => console.error("Erreur chargement livres:", err));
  }, [id]);

  // 2. Fonction pour charger les VRAIS versets sur le graphe
  const handleAddChapter = async () => {
    if (!selectedBook || !selectedChapter) return;
    setLoading(true);

    try {
      const res = await api.get(`/chapter/${selectedBook}/${selectedChapter}`);
      // On prend les 3 premiers versets pour ne pas surcharger l'écran d'un coup
      const verses = res.data.verses.slice(0, 3);

      const newNodes = verses.map((v) => ({
        id: `verse-${selectedBook}-${selectedChapter}-${v.verse}-${Date.now()}`,
        position: {
          x: Math.random() * 300 + 100,
          y: Math.random() * 300 + 100,
        },
        data: {
          label: `📖 ${selectedBook} ${selectedChapter}:${v.verse}\n"${v.text}"`,
        },
        style: {
          background: "#ffffff",
          color: "#1e293b",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          padding: "15px",
          fontWeight: "500",
          textAlign: "center",
          width: 280,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
      }));

      setNodes((nds) => [...nds, ...newNodes]);
    } catch (err) {
      alert("Erreur : Chapitre introuvable !");
    } finally {
      setLoading(false);
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
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Barre supérieure */}
      <div className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            {graphDetails?.title || "Chargement..."}
          </h1>
        </div>

        <button className="flex items-center gap-2 bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-900 transition shadow-md">
          <Save size={18} /> Sauvegarder le Graphe
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Panneau latéral : Bibliothèque */}
        <div className="w-80 bg-white border-r border-slate-200 shadow-lg z-10 p-6 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Library className="text-blue-500" /> Bibliothèque
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Livre :
              </label>
              <select
                className="mt-1 w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
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
                className="mt-1 w-full border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddChapter}
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-200 transition"
            >
              <Search size={18} />{" "}
              {loading ? "Recherche..." : "Extraire les versets"}
            </button>
          </div>

          <div className="mt-auto text-xs text-slate-400 text-center">
            Astuce : Sélectionnez un chapitre pour ajouter ses premiers versets
            au canevas.
          </div>
        </div>

        {/* Le Canvas React Flow */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <MiniMap
              nodeColor={(n) => "#3b82f6"}
              maskColor="rgba(240, 249, 255, 0.7)"
            />
            <Background variant="dots" gap={20} size={2} color="#94a3b8" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
