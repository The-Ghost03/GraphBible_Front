import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import axios from 'axios';
import 'reactflow/dist/style.css';

// L'adresse de ton API FastAPI
const API_URL = 'http://161.97.105.109:8070'; 

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [loading, setLoading] = useState(false);

  // 1. Charger la liste des livres au démarrage
  useEffect(() => {
    axios.get(`${API_URL}/books`)
      .then(res => {
        setBooks(res.data.books);
        if (res.data.books.length > 0) {
          setSelectedBook(res.data.books[0].name);
        }
      })
      .catch(err => console.error("Erreur chargement livres:", err));
  }, []);

  // 2. Fonction pour charger un chapitre et l'ajouter au graphe
  const loadChapter = async () => {
    if (!selectedBook || !selectedChapter) return;
    setLoading(true);
    
    try {
      const res = await axios.get(`${API_URL}/chapter/${selectedBook}/${selectedChapter}`);
      const verses = res.data.verses;
      
      // Pour éviter de surcharger l'écran, on n'affiche que les 5 premiers versets pour l'instant
      const newNodes = verses.slice(0, 5).map((v, index) => {
        // On calcule une position un peu aléatoire pour qu'ils ne se superposent pas tous
        const randomX = Math.random() * 500;
        const randomY = Math.random() * 500;

        return {
          id: `${selectedBook}-${selectedChapter}-${v.verse}-${Date.now()}`, // ID unique
          position: { x: randomX, y: randomY },
          data: { label: `📖 ${selectedBook} ${selectedChapter}:${v.verse}\n"${v.text}"` },
          style: { 
            background: '#ffffff', color: '#1e293b', 
            border: '2px solid #3b82f6', borderRadius: '12px', 
            padding: '15px', fontWeight: '500', 
            textAlign: 'center', width: 280,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }
        };
      });

      // On ajoute les nouveaux versets à ceux déjà présents sur le graphe
      setNodes((nds) => [...nds, ...newNodes]);
      
    } catch (err) {
      alert("Erreur lors du chargement du chapitre. Vérifie le numéro !");
    } finally {
      setLoading(false);
    }
  };

  // 3. Permet de relier les bulles entre elles avec la souris
  const onConnect = useCallback((params) => {
    const edgeParams = { ...params, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } };
    setEdges((eds) => addEdge(edgeParams, eds));
  }, [setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      
      {/* Panneau latéral gauche (Sidebar) */}
      <div className="w-80 bg-white shadow-2xl z-10 flex flex-col p-6 border-r border-slate-200">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">BibleGraph 🌿</h1>
        <p className="text-sm text-slate-500 mb-6">Explore les écritures en créant ton propre réseau de connaissances.</p>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Livre de la Bible :</label>
            <select 
              className="mt-1 w-full border border-slate-300 p-2 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={selectedBook} 
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              {books.map(b => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Chapitre :</label>
            <input 
              type="number" 
              min="1" 
              className="mt-1 w-full border border-slate-300 p-2 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={selectedChapter} 
              onChange={(e) => setSelectedChapter(e.target.value)} 
            />
          </div>

          <button 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-2"
            onClick={loadChapter}
            disabled={loading}
          >
            {loading ? 'Chargement...' : '➕ Ajouter au graphe'}
          </button>
          
          <button 
            className="w-full bg-slate-200 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-300 transition mt-4"
            onClick={() => { setNodes([]); setEdges([]); }}
          >
            🗑️ Vider le tableau
          </button>
        </div>
      </div>

      {/* Zone principale du Graphe */}
      <div className="flex-1 relative bg-slate-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap nodeColor={(n) => '#3b82f6'} maskColor="rgba(240, 249, 255, 0.7)" />
          <Background variant="dots" gap={20} size={2} color="#94a3b8" />
        </ReactFlow>
      </div>
      
    </div>
  );
}
