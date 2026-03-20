import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, FolderPlus, BookOpen, ChevronRight } from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [graphs, setGraphs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Charger les graphes au démarrage
  useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    try {
      const res = await api.get("/graphs/");
      setGraphs(res.data.graphs);
    } catch (err) {
      console.error("Erreur lors du chargement des graphes", err);
    }
  };

  const handleCreateGraph = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await api.post("/graphs/", { title, description, is_public: false });
      setTitle("");
      setDescription("");
      setIsCreating(false);
      fetchGraphs(); // On recharge la liste après la création
    } catch (err) {
      alert("Erreur lors de la création du graphe.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-blue-600 flex items-center gap-2">
          BibleGraph 🌿{" "}
          <span className="text-xl text-slate-400 font-medium">
            | Mon Espace
          </span>
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition font-medium"
        >
          <LogOut size={20} /> Se déconnecter
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne de gauche : Création */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FolderPlus className="text-blue-500" /> Nouveau Graphe
            </h2>
            <form onSubmit={handleCreateGraph} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Titre (ex: Les miracles de Jésus)"
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Petite description de votre étude..."
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                Créer l'étude
              </button>
            </form>
          </div>
        </div>

        {/* Colonne de droite : Liste des graphes */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-500" /> Mes Études en cours
          </h2>

          {graphs.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
              Aucun graphe pour le moment. Créez votre première étude sur la
              gauche !
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {graphs.map((graph) => (
                <div
                  key={graph.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
                  onClick={() => navigate(`/graph/${graph.id}`)}
                >
                  <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition">
                    {graph.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {graph.description || "Aucune description"}
                  </p>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Ouvrir le tableau</span>
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-1 transition text-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
