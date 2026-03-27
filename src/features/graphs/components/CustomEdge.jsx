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

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onDelete = (evt) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const onToggleDash = (evt) => {
    evt.stopPropagation();
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            animated: !isDashed,
            data: { ...edge.data, isDashed: !isDashed },
          };
        }
        return edge;
      }),
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
          // 🚀 OPACITY-100 SUR MOBILE, HOVER SUR PC
          className="nodrag nopan flex items-center gap-1 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300"
        >
          <button
            className="w-6 h-6 bg-white text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-100 transition-all border border-slate-200 shadow-sm cursor-pointer"
            onClick={onToggleDash}
          >
            <TypeOutline size={12} />
          </button>
          <button
            className="w-6 h-6 bg-white text-slate-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-slate-200 shadow-sm cursor-pointer"
            onClick={onDelete}
          >
            <X size={14} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
