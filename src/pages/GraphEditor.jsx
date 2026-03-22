import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { X, Loader2, Settings2 } from "lucide-react";

import { useGraphLogic } from "@/features/graphs/hooks/useGraphLogic";
import EditorTopbar from "@/features/graphs/components/EditorTopbar";
import EditorSidebar from "@/features/graphs/components/EditorSidebar";
import NoteNode from "@/features/graphs/components/NoteNode";

// Shadcn UI (pour relooker la modale des paramètres)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function GraphEditor() {
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logic = useGraphLogic(id, isMobile, () => setIsSidebarOpen(false));
  const nodeTypes = useMemo(() => ({ note: NoteNode }), []);

  return (
    <ReactFlowProvider>
      {/* 🚀 h-[100dvh] empêche la barre du haut de disparaître sur mobile ! */}
      <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden font-sans relative">
        <EditorTopbar
          graphDetails={logic.graphDetails}
          isSaving={logic.isSaving}
          onSave={logic.handleSave}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSettings={() => logic.setIsSettingsModalOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* LA BARRE LATÉRALE (Gère automatiquement Mobile / Desktop via Shadcn) */}
          <EditorSidebar
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            books={logic.books}
            isBooksLoading={logic.isBooksLoading}
            selectedBook={logic.selectedBook}
            setSelectedBook={logic.setSelectedBook}
            selectedChapter={logic.selectedChapter}
            setSelectedChapter={logic.setSelectedChapter}
            verseStart={logic.verseStart}
            setVerseStart={logic.setVerseStart}
            verseEnd={logic.verseEnd}
            setVerseEnd={logic.setVerseEnd}
            loading={logic.loading}
            onAddPassage={logic.handleAddSpecificPassage}
            onAddNote={logic.handleAddNote}
          />

          {/* LE CANEVAS REACT FLOW */}
          <div className="flex-1 w-full h-full relative z-0">
            <ReactFlow
              nodes={logic.nodes}
              edges={logic.edges}
              nodeTypes={nodeTypes}
              onNodesChange={logic.onNodesChange}
              onEdgesChange={logic.onEdgesChange}
              onConnect={logic.onConnect}
              onInit={logic.setReactFlowInstance}
              fitView
              panOnScroll={true}
              zoomOnDoubleClick={!isMobile}
            >
              <Controls className="mb-4 shadow-sm border-slate-200" />
              {!isMobile && (
                <MiniMap
                  nodeColor={() => "#3b82f6"}
                  maskColor="rgba(240, 249, 255, 0.7)"
                  className="rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                />
              )}
              <Background
                variant="dots"
                gap={isMobile ? 15 : 20}
                size={2}
                color="#cbd5e1"
              />
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* LA MODALE DES PARAMÈTRES (Relookée Premium) */}
      {logic.isSettingsModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings2 size={20} className="text-blue-500" /> Paramètres
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logic.setIsSettingsModalOpen(false)}
                className="h-8 w-8 text-slate-400"
              >
                <X size={18} />
              </Button>
            </div>

            <form onSubmit={logic.handleUpdateMetadata} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="editTitle"
                  className="text-sm font-bold text-slate-700"
                >
                  Titre de l'étude
                </Label>
                <Input
                  id="editTitle"
                  className="h-10 bg-slate-50 border-slate-200"
                  value={logic.editTitle}
                  onChange={(e) => logic.setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editDesc"
                  className="text-sm font-bold text-slate-700"
                >
                  Description
                </Label>
                <Textarea
                  id="editDesc"
                  className="resize-none h-24 bg-slate-50 border-slate-200"
                  value={logic.editDesc}
                  onChange={(e) => logic.setEditDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logic.setIsSettingsModalOpen(false)}
                  className="flex-1 h-10 border-slate-200 font-semibold"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={logic.isUpdatingMeta}
                  className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 font-semibold"
                >
                  {logic.isUpdatingMeta ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  ) : null}
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ReactFlowProvider>
  );
}
