import { ArrowLeft, Save, Menu, Loader2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditorTopbar({
  graphDetails,
  isSaving,
  onSave,
  onOpenSidebar,
  onOpenSettings,
}) {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 md:px-6 z-20 shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <h1
            className="text-lg md:text-xl font-bold text-slate-800 truncate max-w-[150px] md:max-w-xs"
            title={graphDetails?.title}
          >
            {graphDetails?.title || "Chargement..."}
          </h1>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
      <button
        onClick={onSave}
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
  );
}
