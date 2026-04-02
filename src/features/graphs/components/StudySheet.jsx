import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  X,
  FileText,
} from "lucide-react";

export default function StudySheet({ initialContent, title, onClose, onSave }) {
  const [content, setContent] = useState(
    initialContent ||
      "<h1>Réflexions sur cette étude...</h1><p>Commencez à rédiger ici.</p>",
  );
  const timeoutRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Ajout d'une classe unique pour cibler le CSS
        class:
          "study-sheet-tiptap outline-none p-6 pb-20 w-full h-full text-slate-800",
      },
    },
  });

  // Sauvegarde automatique avec Debounce (1.5s)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSave(content);
    }, 1500);

    return () => clearTimeout(timeoutRef.current);
  }, [content, onSave]);

  return (
    <div className="absolute inset-0 z-40 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
      {/* 🚀 STYLES SÉCURISÉS POUR L'ÉDITEUR */}
      <style>{`
        .study-sheet-tiptap h1 { font-size: 1.875rem; font-weight: 800; margin-bottom: 1rem; color: #0f172a; }
        .study-sheet-tiptap h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1e293b; }
        .study-sheet-tiptap h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #334155; }
        .study-sheet-tiptap p { margin-bottom: 1rem; line-height: 1.6; }
        .study-sheet-tiptap ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .study-sheet-tiptap ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .study-sheet-tiptap li { margin-bottom: 0.25rem; display: list-item; }
        .study-sheet-tiptap blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; font-style: italic; color: #475569; margin-bottom: 1rem; }
      `}</style>

      {/* HEADER FICHE */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Fiche d'étude
            </h2>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-md">
              {title}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-colors cursor-pointer shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      {/* BARRE D'OUTILS */}
      <div className="bg-white border-b border-slate-200 p-2 shrink-0 flex justify-center shadow-sm">
        {editor && (
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 max-w-4xl w-full">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("heading", { level: 1 }) ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Titre 1"
            >
              <Heading1 size={18} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("heading", { level: 2 }) ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Titre 2"
            >
              <Heading2 size={18} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("heading", { level: 3 }) ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Titre 3"
            >
              <Heading3 size={18} />
            </button>
            <div className="w-px h-6 bg-slate-300 mx-1"></div>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("bold") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("italic") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("strike") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
            >
              <Strikethrough size={18} />
            </button>
            <div className="w-px h-6 bg-slate-300 mx-1"></div>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("bulletList") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Liste à puces"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("orderedList") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Liste numérotée"
            >
              <ListOrdered size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-slate-100 ${editor.isActive("blockquote") ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
              title="Citation"
            >
              <Quote size={18} />
            </button>
            <div className="hidden sm:block w-px h-6 bg-slate-300 mx-1"></div>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              className="hidden sm:block p-2 rounded hover:bg-slate-100 text-slate-600"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              className="hidden sm:block p-2 rounded hover:bg-slate-100 text-slate-600"
            >
              <Redo size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ZONE D'ÉDITION */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto w-full bg-white shadow-md border border-slate-200 rounded-xl min-h-full">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
