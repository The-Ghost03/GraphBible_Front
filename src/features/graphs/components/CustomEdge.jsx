import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import { X, TypeOutline } from "lucide-react";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) {
  const { setEdges } = useReactFlow();
  const isDashed = data?.isDashed || false;
  const edgeLabel = data?.label || "";

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const updateEdgeData = (newData) => {
    setEdges((edges) =>
      edges.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, ...newData } } : e,
      ),
    );
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          strokeWidth: 3,
          strokeDasharray: isDashed ? "7 7" : "none",
        }}
        id={id}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex flex-col items-center gap-1 group"
        >
          {/* 🚀 LE CHAMP DE TEXTE SUR LE LIEN */}
          <input
            type="text"
            value={edgeLabel}
            onChange={(e) => updateEdgeData({ label: e.target.value })}
            placeholder="Lier par..."
            className="bg-white/90 backdrop-blur-sm border border-slate-200 text-xs font-medium text-slate-700 px-2 py-1 rounded shadow-sm outline-none focus:ring-1 focus:ring-blue-500 text-center w-24 focus:w-40 transition-all"
          />

          <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="w-6 h-6 bg-white text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-100 transition-all border border-slate-200 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                updateEdgeData({ isDashed: !isDashed });
              }}
            >
              <TypeOutline size={12} />
            </button>
            <button
              className="w-6 h-6 bg-white text-slate-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-slate-200 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setEdges((eds) => eds.filter((ed) => ed.id !== id));
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
