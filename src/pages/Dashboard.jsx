import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Loader2,
  User,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";
import { useGraphs } from "@/features/graphs/hooks/useGraphs";
import { GraphCardSkeleton } from "@/shared/components/Skeletons";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: graphs = [], isLoading, isError } = useGraphs();

  // Création Rapide (Untitled)
  const handleQuickCreate = async () => {
    setIsCreating(true);
    const toastId = toast.loading("Création de l'espace de travail...");

    try {
      // Le backend FastAPI gère la valeur par défaut "Nouvelle étude"
      const res = await api.post("/graphs/", {});

      queryClient.invalidateQueries({ queryKey: ["graphs"] });
      toast.success("C'est prêt !", { id: toastId });

      // Redirection immédiate vers l'éditeur de graphe
      navigate(`/graph/${res.data.graph_id}`);
    } catch (err) {
      toast.error("Impossible de créer l'étude.", { id: toastId });
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
    toast.success("Déconnecté. À bientôt !");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight cursor-pointer">
              BibleGraph <span className="text-blue-500">🌿</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              className="rounded-full gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600 h-9 px-4 hidden sm:flex cursor-pointer transition-colors"
              onClick={() => navigate("/profile")}
            >
              <User size={16} className="text-blue-500" />
              <span className="font-semibold">Mon Profil</span>
            </Button>

            <Button
              variant="ghost"
              className="rounded-full gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 h-9 px-4 cursor-pointer transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="hidden sm:block font-semibold">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Titre de section et Filtres */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Mes Études
          </h2>
          {graphs.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher une étude..."
                className="h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full sm:w-64 transition-shadow cursor-text"
              />
            </div>
          )}
        </div>

        {isError ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center flex flex-col items-center max-w-lg mx-auto mt-12">
            <span className="text-3xl mb-2">⚠️</span>
            <p className="text-sm font-bold text-red-700 mb-3">
              Impossible de charger vos graphes.
            </p>
            <Button
              variant="outline"
              onClick={() => queryClient.invalidateQueries()}
              className="bg-white border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Réessayer
            </Button>
          </div>
        ) : (
          /* GRILLE PRINCIPALE */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 1. LE GROS BOUTON DE CRÉATION RAPIDE */}
            <div
              onClick={!isCreating ? handleQuickCreate : undefined}
              className={`group flex flex-col items-center justify-center bg-blue-50/50 hover:bg-blue-50 border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl h-[240px] transition-all cursor-pointer ${isCreating ? "opacity-70 pointer-events-none" : "active:scale-[0.98]"}`}
            >
              <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {isCreating ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <Plus size={28} strokeWidth={2.5} />
                )}
              </div>
              <span className="font-bold text-blue-700 text-lg">
                Nouvelle Étude
              </span>
              <span className="text-blue-500/70 text-sm mt-1">Graphe vide</span>
            </div>

            {/* 2. LES SKELETONS OU LES GRAPHES EXISTANTS */}
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-full h-[160px] bg-slate-200 animate-pulse rounded-2xl"></div>
                    <div className="h-5 w-3/4 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                ))
              : graphs.map((graph) => (
                  <div
                    key={graph.id}
                    className="group flex flex-col gap-3 cursor-pointer"
                    onClick={() => navigate(`/graph/${graph.id}`)}
                  >
                    {/* ZONE VIGNETTE (Thumbnail 16:9) */}
                    <div className="relative w-full aspect-video bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-blue-300 transition-all duration-300">
                      {graph.thumbnail ? (
                        <img
                          src={graph.thumbnail}
                          alt={graph.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Placeholder si pas encore de vignette
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                          <div
                            className="w-full h-full opacity-10"
                            style={{
                              backgroundImage:
                                "radial-gradient(#94a3b8 1px, transparent 1px)",
                              backgroundSize: "15px 15px",
                            }}
                          ></div>
                        </div>
                      )}

                      {/* Overlay au survol */}
                      <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all bg-white text-blue-600 font-bold px-4 py-2 rounded-lg shadow-sm">
                          Ouvrir
                        </div>
                      </div>
                    </div>

                    {/* ZONE TEXTE (Titre & Options) */}
                    <div className="flex items-start justify-between px-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {graph.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {graph.description ? (
                            <span className="line-clamp-1">
                              {graph.description}
                            </span>
                          ) : (
                            "Modifié récemment"
                          )}
                        </p>
                      </div>

                      {/* Menu contextuel (Pour plus tard : Renommer, Supprimer, etc.) */}
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        onClick={(e) => e.stopPropagation()} // Évite d'ouvrir le graphe en cliquant sur les points
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </main>
    </div>
  );
}
