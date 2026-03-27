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
  data, // On récupère les data du lien
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
          // On bascule l'état 'isDashed' et on active/désactive l'animation
          return {
            ...edge,
            animated: !isDashed, // Si c'est pointillé, ça s'anime (optionnel, mais sympa)
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
          strokeDasharray: isDashed ? "7 7" : "none", // 🚀 Le style pointillé dynamique
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
          className="nodrag nopan flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          {/* BOUTON CHANGER LE STYLE */}
          <button
            className="w-6 h-6 bg-white text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-100 transition-all border border-slate-200 shadow-sm cursor-pointer"
            onClick={onToggleDash}
            title="Plein / Pointillé"
          >
            <TypeOutline size={12} />
          </button>

          {/* BOUTON SUPPRIMER */}
          <button
            className="w-6 h-6 bg-white text-slate-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-slate-200 shadow-sm cursor-pointer"
            onClick={onDelete}
            title="Supprimer le lien"
          >
            <X size={14} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
