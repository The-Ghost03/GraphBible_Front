import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Menu,
  Cloud,
  CloudOff,
  Edit3,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EditorTopbar({
  graphDetails,
  isSaving,
  onOpenSidebar,
  onTitleChange,
  onExport,
}) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (graphDetails?.title) setLocalTitle(graphDetails.title);
  }, [graphDetails]);

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
      onTitleChange(localTitle);
    } else {
      setLocalTitle(graphDetails?.title || "");
    }
  };

  return (
    <header className="relative h-14 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-3 sm:px-6 z-20 shrink-0">
      <div className="flex items-center gap-1 sm:gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="md:hidden text-slate-600 h-9 w-9 cursor-pointer"
        >
          <Menu size={20} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-slate-500 hover:text-slate-800 h-9 w-9 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </Button>

        <Separator
          orientation="vertical"
          className="h-5 mx-1 hidden sm:block"
        />

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

        <Separator
          orientation="vertical"
          className="h-5 mx-1 hidden sm:block"
        />

        {/* 🚀 LE BOUTON D'EXPORT COMPLET */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors shadow-sm"
            >
              <Download size={14} />{" "}
              <span className="hidden sm:inline">Exporter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl p-1 shadow-lg border-slate-200"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5 bg-slate-50 rounded-t-lg">
              Le Graphe Visuel
            </div>
            <DropdownMenuItem
              onClick={() => onExport("png")}
              className="cursor-pointer font-medium text-slate-700 mt-1"
            >
              <ImageIcon size={14} className="mr-2 text-slate-400" /> En Image
              (PNG)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport("pdf")}
              className="cursor-pointer font-medium text-slate-700"
            >
              <FileText size={14} className="mr-2 text-slate-400" /> En Document
              (PDF)
            </DropdownMenuItem>

            <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1.5 bg-slate-50 mt-1">
              La Fiche d'étude
            </div>
            <DropdownMenuItem
              onClick={() => onExport("study-sheet")}
              className="cursor-pointer font-bold text-blue-600 mb-1"
            >
              <Download size={14} className="mr-2" /> Télécharger en PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
