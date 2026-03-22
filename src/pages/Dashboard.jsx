import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  FolderPlus,
  BookOpen,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"; // <-- 1. Import Toast
import api from "../services/api";
import { useAuthStore } from "../features/auth/store";
import { useGraphs } from "../features/graphs/hooks/useGraphs";
import { GraphCardSkeleton } from "../shared/components/Skeletons"; // <-- 2. Import Skeleton

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const { data: graphs = [], isLoading, isError } = useGraphs();

  const handleCreateGraph = async (e) => {
    e.preventDefault();
    if (!title) return;

    setIsCreating(true);
    // 3. Toast de chargement (promesse)
    const toastId = toast.loading("Création de l'étude en cours...");

    try {
      await api.post("/graphs/", { title, description, is_public: false });
      setTitle("");
      setDescription("");

      queryClient.invalidateQueries({ queryKey: ["graphs"] });
      // 4. Toast Succès
      toast.success("Super ! Ton étude a été créée.", { id: toastId });
    } catch (err) {
      // 5. Toast Erreur (en remplaçant l'alert)
      toast.error("Oups, impossible de créer le graphe.", { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
    toast.success("Déconnecté. À bientôt !");
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      {/* HEADER CORRIGÉ ET STYLÉ */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 flex items-center gap-2">
          BibleGraph 🌿{" "}
          <span className="text-xl text-slate-400 font-medium hidden sm:inline">
            | Mon Espace
          </span>
        </h1>

        {/* LE GROUPE DE BOUTONS (C'est ça qui corrige l'alignement !) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Bouton Profil */}
          <button
            onClick={() => navigate("/profile")}
            className="group flex items-center gap-2 sm:gap-3 text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-2 py-2 sm:px-2 sm:pr-4 rounded-full transition-all shadow-sm active:scale-95"
          >
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              👤
            </div>
            <span className="font-semibold text-sm hidden sm:block">
              Mon Profil
            </span>
          </button>

          {/* Séparateur vertical (caché sur mobile) */}
          <div className="w-px h-8 bg-slate-300 hidden sm:block"></div>

          {/* Bouton Déconnexion */}
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 p-2.5 sm:px-4 sm:py-2.5 rounded-full sm:rounded-xl transition-all shadow-sm active:scale-95"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm hidden sm:block">
              Déconnexion
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne Création (À GAUCHE) */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FolderPlus className="text-blue-500" /> Nouveau Graphe
            </h2>
            <form onSubmit={handleCreateGraph} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Titre (ex: Les miracles de Jésus)"
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Petite description de votre étude..."
                className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 transition-shadow"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-400 active:scale-95"
              >
                {isCreating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Créer l'étude"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Colonne Liste (À DROITE) */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-500" /> Mes Études en cours
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GraphCardSkeleton />
              <GraphCardSkeleton />
              <GraphCardSkeleton />
              <GraphCardSkeleton />
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-600 text-center flex flex-col items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <p className="font-medium">Impossible de charger vos graphes.</p>
            </div>
          ) : graphs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-300 text-center flex flex-col items-center justify-center gap-3">
              <FolderPlus size={40} className="text-slate-300" />
              <p className="text-slate-500 font-medium">
                Aucun graphe pour le moment.
              </p>
              <p className="text-sm text-slate-400">
                Créez votre première étude sur le panneau de gauche !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {graphs.map((graph) => (
                <div
                  key={graph.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group active:scale-[0.98]"
                  onClick={() => navigate(`/graph/${graph.id}`)}
                >
                  <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {graph.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                    {graph.description || "Aucune description"}
                  </p>
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-400 border-t border-slate-100 pt-4">
                    <span>Ouvrir l'étude</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform text-blue-500"
                      />
                    </div>
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
