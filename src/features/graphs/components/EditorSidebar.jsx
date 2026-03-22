import { Library, PlusCircle, X, Loader2 } from "lucide-react";
import { BooksLoaderSkeleton } from "@/shared/components/Skeletons";

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
  return (
    <div
      className={`absolute md:relative z-40 h-full bg-white shadow-2xl md:shadow-lg border-r border-slate-200 w-80 flex flex-col gap-6 transition-transform duration-300 ease-in-out ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between p-6 pb-0">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Library className="text-blue-500" /> Ajouter
        </h2>
        <button
          onClick={onClose}
          className="md:hidden p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-6 overflow-y-auto pb-6">
        <div>
          <label className="text-sm font-semibold text-slate-600">
            Livre :
          </label>
          {isBooksLoading ? (
            <BooksLoaderSkeleton />
          ) : (
            <select
              className="mt-1 w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-base"
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
        <div>
          <label className="text-sm font-semibold text-slate-600">
            Chapitre :
          </label>
          <input
            type="number"
            min="1"
            className="mt-1 w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-base"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-600">De :</label>
            <input
              type="number"
              min="1"
              className="mt-1 w-full border border-slate-300 p-3 rounded-lg bg-slate-50 text-center font-bold text-blue-700 text-base"
              value={verseStart}
              onChange={(e) => setVerseStart(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">À :</label>
            <input
              type="number"
              min="1"
              className="mt-1 w-full border border-slate-300 p-3 rounded-lg bg-slate-50 text-center font-bold text-blue-700 text-base"
              value={verseEnd}
              onChange={(e) => setVerseEnd(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={onAddPassage}
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 md:py-4 rounded-lg hover:bg-blue-700 transition shadow-md active:scale-95 transition-transform"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <PlusCircle size={18} />
          )}{" "}
          {loading ? "Ajout..." : "Ajouter le passage"}
        </button>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            📝 Réflexions
          </h3>
          <button
            onClick={onAddNote}
            className="w-full flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 border border-yellow-300 font-bold py-3 rounded-lg hover:bg-yellow-200 transition shadow-sm active:scale-95 transition-transform"
          >
            <PlusCircle size={18} /> Ajouter un Post-it
          </button>
        </div>
      </div>
    </div>
  );
}
