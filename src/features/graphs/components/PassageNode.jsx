import { Handle, Position, useReactFlow } from "reactflow";
import { X, BookOpen, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const magneticHandleClass =
  "relative !w-3.5 !h-3.5 !bg-blue-500 !border-2 !border-white after:absolute after:inset-[-12px] after:bg-transparent after:rounded-full after:cursor-crosshair";

// Palette de couleurs adaptée pour les versets (bordure + icône)
const passageColors = {
  blue: {
    border: "border-blue-500",
    text: "text-blue-700",
    icon: "text-blue-500",
    label: "Bleu Classique",
  },
  purple: {
    border: "border-purple-500",
    text: "text-purple-700",
    icon: "text-purple-500",
    label: "Violet Étude",
  },
  emerald: {
    border: "border-emerald-500",
    text: "text-emerald-700",
    icon: "text-emerald-500",
    label: "Émeraude",
  },
  rose: {
    border: "border-rose-500",
    text: "text-rose-700",
    icon: "text-rose-500",
    label: "Rose Thème",
  },
  slate: {
    border: "border-slate-500",
    text: "text-slate-700",
    icon: "text-slate-500",
    label: "Gris Neutre",
  },
};

export default function PassageNode({ id, data, isConnectable }) {
  const { setNodes } = useReactFlow();

  const nodeColor =
    data.color && passageColors[data.color] ? data.color : "blue";
  const colorScheme = passageColors[nodeColor];

  const onDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

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
      className={`bg-white border-2 ${colorScheme.border} shadow-sm rounded-xl p-4 min-w-[280px] max-w-[350px] group transition-all hover:shadow-md`}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className={magneticHandleClass}
      />

      <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
        <div
          className={`text-sm font-bold ${colorScheme.text} flex items-center gap-2`}
        >
          <BookOpen size={16} className={colorScheme.icon} /> {data.reference}
        </div>

        {/* 🚀 OPACITY-100 SUR MOBILE, HOVER SUR PC */}
        <div className="flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-400 hover:text-slate-700 outline-none p-1 rounded cursor-pointer transition-colors">
                <Palette size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-xl">
              {Object.entries(passageColors).map(([key, scheme]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onChangeColor(key)}
                  className="cursor-pointer gap-2 font-medium text-slate-700"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${scheme.border}`}
                  ></div>
                  <span>{scheme.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
            title="Supprimer le passage"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="text-[15px] text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
        {data.text}
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
