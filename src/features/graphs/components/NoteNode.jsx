import { Handle, Position, useReactFlow } from "reactflow";

export default function NoteNode({ id, data, isConnectable }) {
  const { setNodes } = useReactFlow();

  // Cette fonction met à jour le texte du noeud dans la mémoire de React Flow
  const onChange = (evt) => {
    const newText = evt.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          // On met à jour la donnée "text" spécifique à ce noeud
          return { ...node, data: { ...node.data, text: newText } };
        }
        return node;
      }),
    );
  };

  return (
    <div className="bg-yellow-100 border border-yellow-300 shadow-md rounded-lg p-3 min-w-[220px]">
      {/* Point d'accroche en haut */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-yellow-500"
      />

      <div className="flex flex-col">
        <div className="text-xs font-bold text-yellow-700 mb-2 border-b border-yellow-200 pb-1 flex items-center gap-1">
          📌 Note d'étude
        </div>

        {/* L'astuce cruciale ici est la classe "nodrag" : elle empêche React Flow de 
            déplacer le composant quand on essaie juste de sélectionner le texte ! */}
        <textarea
          className="nodrag bg-transparent border-none outline-none resize-none text-sm text-slate-800 placeholder-yellow-600/50 w-full min-h-[80px]"
          value={data.text || ""}
          onChange={onChange}
          placeholder="Tapez votre réflexion ici..."
        />
      </div>

      {/* Point d'accroche en bas */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-yellow-500"
      />
    </div>
  );
}
