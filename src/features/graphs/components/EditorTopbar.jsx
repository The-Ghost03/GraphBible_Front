import { ArrowLeft, Save, Menu, Loader2, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function EditorTopbar({
  graphDetails,
  isSaving,
  onSave,
  onOpenSidebar,
  onOpenSettings,
}) {
  const navigate = useNavigate();

  return (
    <header className="relative h-14 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-3 sm:px-6 z-20 shrink-0">
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Menu Hamburger (Seulement Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="md:hidden text-slate-600 h-9 w-9"
        >
          <Menu size={20} />
        </Button>

        {/* Bouton Retour */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-slate-500 hover:text-slate-800 h-9 w-9"
        >
          <ArrowLeft size={18} />
        </Button>

        <Separator
          orientation="vertical"
          className="h-5 mx-1 hidden sm:block"
        />

        {/* Titre & Paramètres */}
        <div className="flex items-center gap-2 px-1">
          <h1
            className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[130px] sm:max-w-xs"
            title={graphDetails?.title}
          >
            {graphDetails?.title || "Chargement..."}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <Settings2 size={16} />
          </Button>
        </div>
      </div>

      {/* Bouton Sauvegarder */}
      <Button
        onClick={onSave}
        disabled={isSaving}
        className="h-9 px-3 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm rounded-lg text-xs sm:text-sm"
      >
        {isSaving ? (
          <Loader2 className="animate-spin sm:mr-2" size={16} />
        ) : (
          <Save size={16} className="hidden sm:block sm:mr-2" />
        )}
        <span className={isSaving ? "hidden sm:inline" : ""}>
          {isSaving ? "Sauvegarde..." : "Enregistrer"}
        </span>
      </Button>
    </header>
  );
}
