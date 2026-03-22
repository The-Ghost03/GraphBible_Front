import { Handle, Position, useReactFlow } from "reactflow";

export default function NoteNode({ id, data, isConnectable }) {
  const { setNodes } = useReactFlow();

  const onChange = (evt) => {
    const newText = evt.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, text: newText } };
        }
        return node;
      }),
    );
  };

  return (
    <div className="bg-amber-50/90 backdrop-blur-sm border border-amber-200 shadow-sm rounded-xl p-3 min-w-[240px] group transition-shadow hover:shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-amber-400 border-2 border-white"
      />

      <div className="flex flex-col">
        <div className="text-[11px] font-bold text-amber-700/70 mb-2 uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-100 pb-1.5">
          <span className="text-amber-500">📝</span> Note de réflexion
        </div>

        <textarea
          className="nodrag bg-transparent border-none outline-none resize-none text-sm text-slate-800 placeholder-amber-700/30 w-full min-h-[80px] leading-relaxed"
          value={data.text || ""}
          onChange={onChange}
          placeholder="Écrivez votre réflexion ici..."
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-amber-400 border-2 border-white"
      />
    </div>
  );
}
