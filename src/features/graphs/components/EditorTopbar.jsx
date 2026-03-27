import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Menu,
  Settings2,
  Cloud,
  CloudOff,
  Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function EditorTopbar({
  graphDetails,
  isSaving,
  onOpenSidebar,
  onOpenSettings,
  onTitleChange, // Nouvelle fonction passée par GraphEditor
}) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState("");
  const inputRef = useRef(null);

  // Synchroniser le titre local avec le titre du graphe
  useEffect(() => {
    if (graphDetails?.title) setLocalTitle(graphDetails.title);
  }, [graphDetails]);

  // Focus automatique quand on clique sur le titre
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlurOrEnter = (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    setIsEditing(false);
    if (localTitle.trim() !== "" && localTitle !== graphDetails?.title) {
      onTitleChange(localTitle); // Déclenche la sauvegarde silencieuse du titre
    } else {
      setLocalTitle(graphDetails?.title || ""); // Restaure si vide
    }
  };

  return (
    <header className="relative h-14 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-3 sm:px-6 z-20 shrink-0">
      <div className="flex items-center gap-1 sm:gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="md:hidden text-slate-600 h-9 w-9"
        >
          <Menu size={20} />
        </Button>

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

        {/* RENOMMAGE INLINE */}
        <div className="flex items-center gap-2 px-1 flex-1 max-w-sm">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleBlurOrEnter}
              onKeyDown={handleBlurOrEnter}
              className="h-8 w-full font-bold text-sm sm:text-base text-slate-900 bg-slate-100 border-none rounded px-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-2 cursor-pointer py-1 px-2 -ml-2 rounded hover:bg-slate-50 transition-colors"
            >
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">
                {graphDetails?.title || "Chargement..."}
              </h1>
              <Edit3
                size={14}
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* STATUT AUTO-SAVE INVISIBLE */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400">
          {isSaving ? (
            <>
              <CloudOff className="animate-pulse text-amber-500" size={16} />{" "}
              <span className="hidden sm:inline text-amber-600">
                Enregistrement...
              </span>
            </>
          ) : (
            <>
              <Cloud className="text-emerald-500" size={16} />{" "}
              <span className="hidden sm:inline">Sauvegardé</span>
            </>
          )}
        </div>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
        >
          <Settings2 size={16} />
        </Button>
      </div>
    </header>
  );
}
