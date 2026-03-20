import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeft, Save, Plus } from "lucide-react";
import api from "../api";

export default function GraphEditor() {
  const { id } = useParams(); // L'ID du graphe depuis l'URL
  const navigate = useNavigate();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphDetails, setGraphDetails] = useState(null);

  // Charger les infos du graphe au démarrage (Titre, etc.)
  // TODO: Plus tard, on chargera aussi les noeuds existants
  useEffect(() => {
    // Pour l'instant on fait juste semblant que c'est chargé, on verra l'API plus tard
    setGraphDetails({ title: `Étude (ID: ${id})` });
  }, [id]);

  // Connecter deux nœuds manuellement
  const onConnect = useCallback(
    (params) => {
      const edgeParams = {
        ...params,
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edgeParams, eds));
    },
    [setEdges],
  );

  // Fonction factice pour simuler l'ajout d'un verset
  const handleAddDemoVerse = () => {
    const newNode = {
      id: `demo-${Date.now()}`,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { label: "📖 Jean 1:1\nAu commencement était la Parole..." },
      style: {
        background: "#ffffff",
        color: "#1e293b",
        border: "2px solid #3b82f6",
        borderRadius: "12px",
        padding: "15px",
        fontWeight: "500",
        textAlign: "center",
        width: 250,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Barre de navigation / Outils */}
      <div className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
            title="Retour au tableau de bord"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            {graphDetails?.title || "Chargement..."}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddDemoVerse}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition"
          >
            <Plus size={18} /> Ajouter un verset test
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
            <Save size={18} /> Sauvegarder
          </button>
        </div>
      </div>

      {/* Le Canvas React Flow */}
      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap
            nodeColor={(n) => "#3b82f6"}
            maskColor="rgba(240, 249, 255, 0.7)"
          />
          <Background variant="dots" gap={20} size={2} color="#94a3b8" />
        </ReactFlow>
      </div>
    </div>
  );
}
