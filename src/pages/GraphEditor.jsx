import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { X, Loader2 } from "lucide-react";

import { useGraphLogic } from "@/features/graphs/hooks/useGraphLogic";
import EditorTopbar from "@/features/graphs/components/EditorTopbar";
import EditorSidebar from "@/features/graphs/components/EditorSidebar";
import NoteNode from "@/features/graphs/components/NoteNode";

export default function GraphEditor() {
  const { id } = useParams();

  // Gestion UI du mobile (On le garde ici car ça gère le Layout global)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧠 LE CERVEAU : On importe toute la logique en 1 ligne !
  const logic = useGraphLogic(id, isMobile, () => setIsSidebarOpen(false));

  // Les Custom Nodes pour React Flow
  const nodeTypes = useMemo(() => ({ note: NoteNode }), []);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans relative">
        {/* LA BARRE DU HAUT */}
        <EditorTopbar
          graphDetails={logic.graphDetails}
          isSaving={logic.isSaving}
          onSave={logic.handleSave}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSettings={() => logic.setIsSettingsModalOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Overlay Mobile */}
          {isMobile && isSidebarOpen && (
            <div
              className="absolute inset-0 bg-slate-900/50 z-30 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* LA BARRE LATÉRALE */}
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
          <div className="flex-1 relative">
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
              <Controls className="mb-4" />
              {!isMobile && (
                <MiniMap
                  nodeColor={() => "#3b82f6"}
                  maskColor="rgba(240, 249, 255, 0.7)"
                />
              )}
              <Background
                variant="dots"
                gap={isMobile ? 15 : 20}
                size={2}
                color="#94a3b8"
              />
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* LA MODALE DES PARAMÈTRES (Isolée en bas pour garder le code propre) */}
      {logic.isSettingsModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Paramètres de l'étude
              </h2>
              <button
                onClick={() => logic.setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={logic.handleUpdateMetadata}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Titre de l'étude
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={logic.editTitle}
                  onChange={(e) => logic.setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                  value={logic.editDesc}
                  onChange={(e) => logic.setEditDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => logic.setIsSettingsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={logic.isUpdatingMeta}
                  className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md disabled:bg-blue-400"
                >
                  {logic.isUpdatingMeta ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ReactFlowProvider>
  );
}
