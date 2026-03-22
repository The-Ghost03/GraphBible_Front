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
      {/* HEADER PREMIUM */}
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
              <span>Mon Profil</span>
            </Button>

            {/* Bouton Profil Icone pour Mobile */}
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
              <span className="hidden sm:block">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLONNE GAUCHE : CRÉATION (Prend 4 colonnes sur 12) */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24 border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <FolderPlus className="text-blue-500" size={20} />
                  Nouvelle Étude
                </CardTitle>
                <CardDescription>
                  Créez un nouveau graphe pour commencer à lier des versets.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateGraph} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700">
                      Titre de l'étude
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ex: Les miracles de Jésus"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">
                      Description (Optionnelle)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Notez ici l'objectif de cette étude..."
                      className="resize-none h-24 bg-slate-50"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Créer le graphe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* COLONNE DROITE : LISTE (Prend 8 colonnes sur 12) */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Mes Études en cours
              </h2>
            </div>

            {isLoading ? (
              /* --- SKELETONS SHADCN --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardFooter className="pt-3 border-t border-slate-50">
                      <Skeleton className="h-8 w-1/3" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <Card className="border-red-200 bg-red-50 text-red-600">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center gap-3">
                  <span className="text-4xl">⚠️</span>
                  <p className="font-semibold">
                    Impossible de charger vos graphes.
                  </p>
                  <Button
                    variant="outline"
                    onClick={fetchGraphs}
                    className="mt-2 bg-white text-slate-700"
                  >
                    Réessayer
                  </Button>
                </CardContent>
              </Card>
            ) : graphs.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center p-16 text-center gap-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                    <FolderPlus size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700">
                    Aucun graphe pour le moment
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    Utilisez le formulaire sur la gauche pour créer votre
                    première étude biblique visuelle.
                  </p>
                </CardContent>
              </Card>
            ) : (
              /* --- LISTE DES CARTES SHADCN --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {graphs.map((graph) => (
                  <Card
                    key={graph.id}
                    className="border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
                    onClick={() => navigate(`/graph/${graph.id}`)}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {graph.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1.5 h-10">
                        {graph.description ||
                          "Aucune description fournie pour cette étude."}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-medium text-slate-500">
                      <span>Ouvrir l'étude</span>
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <ChevronRight
                          size={16}
                          className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
