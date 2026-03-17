import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

// 1. On définit nos premiers nœuds (Versets)
const initialNodes = [
  { 
    id: '1', 
    position: { x: 400, y: 100 }, 
    data: { label: '📖 Jean 3:16\n"Car Dieu a tant aimé le monde..."' },
    style: { background: '#3b82f6', color: 'white', borderRadius: '10px', padding: '15px', fontWeight: 'bold', textAlign: 'center', width: 250 }
  },
  { 
    id: '2', 
    position: { x: 400, y: 300 }, 
    data: { label: '📖 Romains 5:8\n"Mais Dieu prouve son amour..."' },
    style: { background: '#10b981', color: 'white', borderRadius: '10px', padding: '15px', fontWeight: 'bold', textAlign: 'center', width: 250 }
  },
];

// 2. On définit la relation entre eux
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Parallèle thématique', style: { stroke: '#64748b', strokeWidth: 2 } }
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Permet à l'utilisateur de tirer de nouveaux traits lui-même
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f8fafc' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap nodeColor={(n) => n.style?.background || '#eee'} />
        <Background variant="dots" gap={15} size={2} color="#cbd5e1" />
      </ReactFlow>
    </div>
  );
}
