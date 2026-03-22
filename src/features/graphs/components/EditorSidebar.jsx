import { Library, PlusCircle, Loader2 } from "lucide-react";
import { BooksLoaderSkeleton } from "@/shared/components/Skeletons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function EditorSidebar({
  isMobile,
  isOpen,
  onClose,
  books,
  isBooksLoading,
  selectedBook,
  setSelectedBook,
  selectedChapter,
  setSelectedChapter,
  verseStart,
  setVerseStart,
  verseEnd,
  setVerseEnd,
  loading,
  onAddPassage,
  onAddNote,
}) {
  // On isole le contenu pour ne pas le coder 2 fois (Desktop/Mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {!isMobile && (
        <div className="h-14 flex items-center px-5 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Library className="text-blue-500" size={18} /> Ajouter des éléments
          </h2>
        </div>
      )}

      <ScrollArea className="flex-1 px-5 py-6">
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">
              Livre biblique
            </Label>
            {isBooksLoading ? (
              <BooksLoaderSkeleton />
            ) : (
              <select
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                {books.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">Chapitre</Label>
            <Input
              type="number"
              min="1"
              className="h-10 bg-slate-50"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                Verset de
              </Label>
              <Input
                type="number"
                min="1"
                className="h-10 bg-slate-50 text-center font-bold text-blue-600"
                value={verseStart}
                onChange={(e) => setVerseStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">À</Label>
              <Input
                type="number"
                min="1"
                className="h-10 bg-slate-50 text-center font-bold text-blue-600"
                value={verseEnd}
                onChange={(e) => setVerseEnd(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={onAddPassage}
            disabled={loading}
            className="w-full h-10 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            {loading ? "Ajout..." : "Ajouter le passage"}
          </Button>

          <Separator className="my-3" />

          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              📝 Réflexions
            </Label>
            <Button
              onClick={onAddNote}
              variant="outline"
              className="w-full h-10 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 font-semibold rounded-lg shadow-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Créer un Post-it
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  // 🚀 Sur Mobile : On utilise le Tiroir (Sheet)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="left"
          className="w-[85vw] sm:w-[350px] p-0 border-r-0"
        >
          <SheetHeader className="h-14 border-b border-slate-100 flex flex-col justify-center px-5 text-left">
            <SheetTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Library className="text-blue-500" size={18} /> Bibliothèque
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  // 💻 Sur Desktop : On utilise une div classique
  return (
    <div className="w-80 h-full border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
      <SidebarContent />
    </div>
  );
}
