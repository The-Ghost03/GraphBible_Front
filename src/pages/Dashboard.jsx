import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderPlus,
  BookOpen,
  ChevronRight,
  LogOut,
  Loader2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";

// --- Imports Shadcn/ui ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [graphs, setGraphs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const fetchGraphs = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await api.get("/graphs");
      setGraphs(res.data.graphs);
    } catch (err) {
      console.error(err);
      setIsError(true);
      toast.error("Impossible de charger les graphes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphs();
  }, []);

  const handleCreateGraph = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post("/graphs", { title, description });
      toast.success("Étude créée !");
      setTitle("");
      setDescription("");
      navigate(`/graph/${res.data.graph_id}`);
    } catch (err) {
      toast.error("Erreur lors de la création.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* HEADER PREMIUM (On n'y touche pas) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">
              BibleGraph <span className="text-blue-500">🌿</span>
            </h1>
            <div className="w-px h-6 bg-slate-200 hidden sm:block mx-2"></div>
            <span className="text-sm font-medium text-slate-500 hidden sm:block">
              Mon Espace
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              className="rounded-full gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600 h-9 px-4 hidden sm:flex"
              onClick={() => navigate("/profile")}
            >
              <User size={16} className="text-blue-500" />
              <span className="font-semibold">Mon Profil</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-blue-600 sm:hidden"
              onClick={() => navigate("/profile")}
            >
              <User size={18} />
            </Button>

            <Button
              variant="ghost"
              className="rounded-full gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 h-9 px-4"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="hidden sm:block font-semibold">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL ÉPURÉ ET COMPACT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLONNE GAUCHE : CRÉATION */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 sticky top-24">
              <div className="mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <FolderPlus size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Nouvelle Étude
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Créez un nouvel espace visuel pour connecter vos versets.
                </p>
              </div>

              <form onSubmit={handleCreateGraph} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="title"
                    className="text-xs font-bold text-slate-700"
                  >
                    Titre de l'étude
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Les miracles de Jésus"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-9 bg-slate-50/50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-xs font-bold text-slate-700 flex justify-between"
                  >
                    Description{" "}
                    <span className="text-slate-400 font-normal">
                      Optionnelle
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Objectif de cette étude..."
                    className="resize-none h-20 bg-slate-50/50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg text-sm leading-relaxed"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm mt-3 text-sm"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Créer le graphe
                </Button>
              </form>
            </div>
          </div>

          {/* COLONNE DROITE : LISTE */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-200/50 text-slate-600 rounded-md flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Mes Études en cours
                </h2>
              </div>

              {graphs.length > 0 && (
                <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-sm">
                  {graphs.length} {graphs.length > 1 ? "études" : "étude"}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-100 p-5 h-[140px] flex flex-col justify-between"
                  >
                    <div>
                      <Skeleton className="h-5 w-3/4 mb-3" />
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-3 w-1/4 mt-4" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center flex flex-col items-center">
                <span className="text-3xl mb-2">⚠️</span>
                <p className="text-sm font-bold text-red-700 mb-3">
                  Impossible de charger vos graphes.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchGraphs}
                  className="bg-white border-red-200 text-red-600 hover:bg-red-50 h-8"
                >
                  Réessayer
                </Button>
              </div>
            ) : graphs.length === 0 ? (
              <div className="bg-transparent border border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  <FolderPlus size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Aucun graphe pour le moment
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Utilisez le formulaire sur la gauche pour créer votre première
                  étude biblique.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {graphs.map((graph) => (
                  <div
                    key={graph.id}
                    onClick={() => navigate(`/graph/${graph.id}`)}
                    className="group relative bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[140px] overflow-hidden"
                  >
                    {/* Liseré magique au survol */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                        {graph.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {graph.description ||
                          "Aucune description fournie. Cliquez pour ouvrir le tableau."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                        Ouvrir l'étude
                      </span>
                      <div className="h-6 w-6 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                        <ChevronRight
                          size={14}
                          className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
