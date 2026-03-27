import { Handle, Position, useReactFlow } from "reactflow";
import { X, Palette } from "lucide-react";
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
    focus: "focus:ring-amber-500",
    label: "Ambre",
  },
  blue: {
    bg: "bg-sky-100",
    border: "border-sky-200",
    text: "text-sky-800",
    focus: "focus:ring-sky-500",
    label: "Ciel",
  },
  green: {
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-800",
    focus: "focus:ring-emerald-500",
    label: "Émeraude",
  },
  pink: {
    bg: "bg-rose-100",
    border: "border-rose-200",
    text: "text-rose-800",
    focus: "focus:ring-rose-500",
    label: "Rose",
  },
};

export default function NoteNode({ id, data, isConnectable }) {
  const { setNodes } = useReactFlow();

  const nodeColor =
    data.color && stickyColors[data.color] ? data.color : "yellow";
  const colorScheme = stickyColors[nodeColor];

  const onChangeText = (evt) => {
    const newText = evt.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id)
          return { ...node, data: { ...node.data, text: newText } };
        return node;
      }),
    );
  };

  const onDelete = () =>
    setNodes((nds) => nds.filter((node) => node.id !== id));

  const onChangeColor = (newColor) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id)
          return { ...node, data: { ...node.data, color: newColor } };
        return node;
      }),
    );
  };

  return (
    <div
      className={`shadow-sm rounded-xl p-3 min-w-[220px] group transition-shadow hover:shadow-lg ${colorScheme.bg} ${colorScheme.border} border`}
    >
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

          {/* 🚀 OPACITY-100 SUR MOBILE, HOVER SUR PC */}
          <div className="flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`text-slate-400 hover:${colorScheme.text} outline-none p-1 rounded cursor-pointer transition-colors`}
                >
                  <Palette size={15} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-xl">
                {Object.entries(stickyColors).map(([key, scheme]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onChangeColor(key)}
                    className="cursor-pointer gap-2 font-medium text-slate-700"
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
              className="text-slate-400 hover:text-red-600 outline-none p-1 rounded cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <textarea
          className={`nodrag bg-transparent border-none outline-none resize-none text-sm w-full min-h-[80px] text-slate-800 placeholder-slate-700/30 ${colorScheme.focus}`}
          value={data.text || ""}
          onChange={onChangeText}
          placeholder="Écrivez votre réflexion ici..."
        />
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
