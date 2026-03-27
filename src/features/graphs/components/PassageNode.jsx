import { Handle, Position, useReactFlow } from "reactflow";
import { X, BookOpen } from "lucide-react";

// La fameuse zone magnétique géante invisible de 40px pour le mobile
const magneticHandleClass =
  "relative !w-3.5 !h-3.5 !bg-blue-500 !border-2 !border-white after:absolute after:inset-[-12px] after:bg-transparent after:rounded-full after:cursor-crosshair";

export default function PassageNode({ id, data, isConnectable }) {
  const { setNodes } = useReactFlow();

  const onDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  return (
    <div className="bg-white border-2 border-blue-500 shadow-sm rounded-xl p-4 min-w-[280px] max-w-[350px] group transition-all hover:shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className={magneticHandleClass}
      />

      <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
        <div className="text-sm font-bold text-blue-700 flex items-center gap-2">
          <BookOpen size={16} /> {data.reference}
        </div>
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
          title="Supprimer le passage"
        >
          <X size={18} />
        </button>
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
