import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import { X } from "lucide-react";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}) {
  const { setEdges } = useReactFlow();

  // Calcule le tracé de la ligne et le centre (pour y placer notre bouton)
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} style={{ ...style, strokeWidth: 2 }} id={id} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all", // Rend le bouton cliquable par-dessus le canevas
          }}
          className="nodrag nopan"
        >
          <button
            className="w-6 h-6 bg-white text-slate-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-slate-200 shadow-sm cursor-pointer group"
            onClick={onEdgeClick}
            title="Supprimer le lien"
          >
            <X
              size={14}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
