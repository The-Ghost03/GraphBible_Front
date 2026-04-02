import { Handle, Position, useReactFlow } from "reactflow";
import { X, Palette, Bold, Italic, List } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const magneticHandleClass =
  "relative !w-3.5 !h-3.5 !bg-slate-400 !border-2 !border-slate-50 after:absolute after:inset-[-12px] after:bg-transparent after:rounded-full after:cursor-crosshair";

const stickyColors = {
  yellow: {
    bg: "bg-amber-100",
    border: "border-amber-200",
    text: "text-amber-800",
    label: "Ambre",
  },
  blue: {
    bg: "bg-sky-100",
    border: "border-sky-200",
    text: "text-sky-800",
    label: "Ciel",
  },
  green: {
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-800",
    label: "Émeraude",
  },
  pink: {
    bg: "bg-rose-100",
    border: "border-rose-200",
    text: "text-rose-800",
    label: "Rose",
  },
};

export default function NoteNode({ id, data, isConnectable }) {
  const { setNodes } = useReactFlow();
  const colorScheme = stickyColors[data.color] || stickyColors.yellow;

  const editor = useEditor({
    extensions: [StarterKit],
    content: data.text || "<p>Nouvelle note...</p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, text: html } } : n,
        ),
      );
    },
    editorProps: {
      attributes: {
        // 🚀 Nouvelle classe ciblée
        class:
          "tiptap-note-content text-sm text-slate-800 leading-snug w-full min-h-[60px] outline-none",
      },
    },
  });

  const onDelete = () => setNodes((nds) => nds.filter((n) => n.id !== id));
  const onChangeColor = (col) =>
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, color: col } } : n,
      ),
    );

  return (
    <div
      className={`shadow-sm rounded-xl p-3 min-w-[250px] max-w-[400px] group transition-shadow hover:shadow-lg ${colorScheme.bg} ${colorScheme.border} border`}
    >
      {/* 🚀 STYLES INFAILLIBLES INJECTÉS DIRECTEMENT */}
      <style>{`
        .tiptap-note-content p { margin: 0 !important; line-height: 1.4 !important; }
        .tiptap-note-content ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-top: 0.25rem !important; margin-bottom: 0.25rem !important; }
        .tiptap-note-content ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-top: 0.25rem !important; margin-bottom: 0.25rem !important; }
        .tiptap-note-content li { display: list-item !important; margin-bottom: 0.15rem !important; }
      `}</style>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className={magneticHandleClass}
      />

      <div className="flex flex-col relative">
        <div className="flex justify-between items-center mb-2 border-b border-amber-200/50 pb-1">
          <div
            className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${colorScheme.text}`}
          >
            📝 Note
          </div>

          <div className="flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity items-center">
            {editor && (
              <div className="flex gap-1 mr-2 bg-white/50 rounded px-1">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 rounded cursor-pointer ${editor.isActive("bold") ? "bg-white text-slate-900" : "text-slate-500 hover:bg-white/50"}`}
                >
                  <Bold size={14} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded cursor-pointer ${editor.isActive("italic") ? "bg-white text-slate-900" : "text-slate-500 hover:bg-white/50"}`}
                >
                  <Italic size={14} />
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`p-1 rounded cursor-pointer ${editor.isActive("bulletList") ? "bg-white text-slate-900" : "text-slate-500 hover:bg-white/50"}`}
                >
                  <List size={14} />
                </button>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`text-slate-400 hover:${colorScheme.text} p-1 rounded transition-colors cursor-pointer`}
                >
                  <Palette size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-xl">
                {Object.entries(stickyColors).map(([key, scheme]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onChangeColor(key)}
                    className="cursor-pointer gap-2"
                  >
                    <div
                      className={`w-4 h-4 rounded ${scheme.bg} ${scheme.border} border`}
                    ></div>
                    <span>{scheme.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={onDelete}
              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="nodrag cursor-text">
          <EditorContent editor={editor} />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className={magneticHandleClass}
      />
    </div>
  );
}
