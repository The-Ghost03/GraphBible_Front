import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Loader2,
  User,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";
import { useGraphs } from "@/features/graphs/hooks/useGraphs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // États pour nos belles modales personnalisées
  const [renameModal, setRenameModal] = useState({
    isOpen: false,
    id: null,
    currentTitle: "",
  });
  const [newTitleInput, setNewTitleInput] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isProcessing, setIsProcessing] = useState(false);

  // 🚀 On récupère la fonction 'refetch' pour forcer le rechargement
  const { data: graphs = [], isLoading, isError, refetch } = useGraphs();

  // 🚀 FORCER L'ACTUALISATION DES VIGNETTES À CHAQUE RETOUR SUR LE DASHBOARD
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleQuickCreate = async () => {
    setIsCreating(true);
    const toastId = toast.loading("Création de l'espace de travail...");

    try {
      const res = await api.post("/graphs/", {});
      await refetch();
      toast.success("C'est prêt !", { id: toastId });
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

  const filteredGraphs = graphs.filter(
    (graph) =>
      graph.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (graph.description &&
        graph.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // --- ACTIONS DES MODALES ---
  const submitRename = async (e) => {
    e.preventDefault();
    if (!newTitleInput.trim() || newTitleInput === renameModal.currentTitle) {
      setRenameModal({ isOpen: false, id: null, currentTitle: "" });
      return;
    }

    setIsProcessing(true);
    try {
      await api.put(`/graphs/${renameModal.id}/metadata`, {
        title: newTitleInput,
      });
      await refetch(); // On met à jour la liste immédiatement
      toast.success("Étude renommée !");
      setRenameModal({ isOpen: false, id: null, currentTitle: "" });
    } catch (err) {
      toast.error("Impossible de renommer l'étude.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      await api.delete(`/graphs/${deleteModal.id}`);
      await refetch(); // On met à jour la liste immédiatement
      toast.success("Étude supprimée.");
      setDeleteModal({ isOpen: false, id: null });
    } catch (err) {
      toast.error("Impossible de supprimer l'étude.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12 relative">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={() => refetch()}
              className="bg-white border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Réessayer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="w-full h-[160px] bg-slate-200 animate-pulse rounded-2xl"></div>
                    <div className="h-5 w-3/4 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                ))
              : filteredGraphs.map((graph) => (
                  <div
                    key={graph.id}
                    className="group flex flex-col gap-3 cursor-pointer"
                    onClick={() => navigate(`/graph/${graph.id}`)}
                  >
                    <div className="relative w-full aspect-video bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-blue-300 transition-all duration-300">
                      {graph.thumbnail ? (
                        <img
                          src={graph.thumbnail}
                          alt={graph.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
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
                      <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all bg-white text-blue-600 font-bold px-4 py-2 rounded-lg shadow-sm">
                          Ouvrir
                        </div>
                      </div>
                    </div>
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

                      {/* VRAI MENU SHADCN */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewTitleInput(graph.title);
                              setRenameModal({
                                isOpen: true,
                                id: graph.id,
                                currentTitle: graph.title,
                              });
                            }}
                            className="cursor-pointer gap-2 font-medium"
                          >
                            <Edit2 size={14} className="text-blue-500" />{" "}
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal({ isOpen: true, id: graph.id });
                            }}
                            className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 font-medium"
                          >
                            <Trash2 size={14} /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </main>

      {/* MODALE RENOMMER */}
      {renameModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Renommer l'étude
              </h3>
              <button
                onClick={() =>
                  setRenameModal({ isOpen: false, id: null, currentTitle: "" })
                }
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitRename}>
              <div className="space-y-3 mb-6">
                <Label className="text-sm font-medium text-slate-700">
                  Nouveau nom
                </Label>
                <Input
                  autoFocus
                  className="h-11 bg-slate-50 border-slate-200 text-base"
                  value={newTitleInput}
                  onChange={(e) => setNewTitleInput(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setRenameModal({
                      isOpen: false,
                      id: null,
                      currentTitle: "",
                    })
                  }
                  disabled={isProcessing}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing || !newTitleInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : null}{" "}
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE SUPPRIMER */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Supprimer l'étude ?
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Cette action détruira le graphe, tous ses versets et vos notes.
              C'est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  "Oui, supprimer"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
