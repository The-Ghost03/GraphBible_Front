import { useEffect, useState, useRef } from "react";
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
        // 🚀 Classe unique pour cibler notre CSS interne
        class:
          "study-sheet-editor outline-none p-6 pb-20 w-full h-full text-slate-800",
      },
    },
  });

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (content !== initialContent) {
        onSave(content);
      }
    }, 1500);
    return () => clearTimeout(timeoutRef.current);
  }, [content, initialContent, onSave]);

  return (
    <div className="absolute inset-0 z-40 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
      {/* 🚀 CSS ENCAPSULÉ INFAILLIBLE */}
      <style>{`
        /* Cibler l'intérieur de l'éditeur Tiptap */
        .study-sheet-editor.ProseMirror { outline: none; min-height: 100%; font-family: system-ui, -apple-system, sans-serif; }
        
        /* Titres */
        .study-sheet-editor.ProseMirror h1 { font-size: 1.875rem !important; font-weight: 800 !important; margin-bottom: 1rem !important; color: #0f172a !important; line-height: 1.2 !important; }
        .study-sheet-editor.ProseMirror h2 { font-size: 1.5rem !important; font-weight: 700 !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; color: #1e293b !important; line-height: 1.3 !important; }
        .study-sheet-editor.ProseMirror h3 { font-size: 1.25rem !important; font-weight: 700 !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; color: #334155 !important; line-height: 1.4 !important; }
        
        /* Texte de base */
        .study-sheet-editor.ProseMirror p { margin-bottom: 1rem !important; line-height: 1.6 !important; }
        
        /* Formatage fort (Essentiel pour Tailwind !) */
        .study-sheet-editor.ProseMirror strong, .study-sheet-editor.ProseMirror b { font-weight: 700 !important; }
        .study-sheet-editor.ProseMirror em, .study-sheet-editor.ProseMirror i { font-style: italic !important; }
        .study-sheet-editor.ProseMirror s, .study-sheet-editor.ProseMirror strike { text-decoration: line-through !important; }
        
        /* Listes */
        .study-sheet-editor.ProseMirror ul { list-style-type: disc !important; padding-left: 2rem !important; margin-bottom: 1rem !important; }
        .study-sheet-editor.ProseMirror ol { list-style-type: decimal !important; padding-left: 2rem !important; margin-bottom: 1rem !important; }
        .study-sheet-editor.ProseMirror li { display: list-item !important; margin-bottom: 0.25rem !important; }
        .study-sheet-editor.ProseMirror li p { margin-bottom: 0 !important; display: inline !important;}
        
        /* Citations */
        .study-sheet-editor.ProseMirror blockquote { border-left: 4px solid #cbd5e1 !important; padding-left: 1rem !important; font-style: italic !important; color: #475569 !important; margin-top: 1rem !important; margin-bottom: 1rem !important; background-color: #f8fafc !important; padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; border-radius: 0 0.5rem 0.5rem 0 !important; }
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
