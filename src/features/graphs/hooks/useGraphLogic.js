import { useState, useCallback, useEffect } from "react";
import { useNodesState, useEdgesState, addEdge } from "reactflow";
import toast from "react-hot-toast";
import api from "@/services/api";

export function useGraphLogic(id, isMobile, closeSidebar) {
  // --- ÉTATS REACT FLOW ---
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // --- ÉTATS MÉTIER ---
  const [graphDetails, setGraphDetails] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [verseStart, setVerseStart] = useState("1");
  const [verseEnd, setVerseEnd] = useState("1");

  // --- ÉTATS UI & CHARGEMENT ---
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBooksLoading, setIsBooksLoading] = useState(true);

  // --- ÉTATS MODALE ---
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isUpdatingMeta, setIsUpdatingMeta] = useState(false);

  // --- CHARGEMENT INITIAL ---
  useEffect(() => {
    setGraphDetails({ title: `Chargement...` });
    api
      .get(`/graphs/${id}/data`)
      .then((res) => {
        setGraphDetails(res.data.graph);
        setEditTitle(res.data.graph.title);
        setEditDesc(res.data.graph.description || "");
        if (res.data.nodes?.length > 0) setNodes(res.data.nodes);
        if (res.data.edges?.length > 0) setEdges(res.data.edges);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le graphe.");
      });

    setIsBooksLoading(true);
    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.books);
        if (res.data.books.length > 0) setSelectedBook(res.data.books[0].name);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsBooksLoading(false));
  }, [id, setNodes, setEdges]);

  // --- FONCTIONS ACTIONS ---
  const handleUpdateMetadata = async (e) => {
    e.preventDefault();
    if (!editTitle) return;
    setIsUpdatingMeta(true);
    const toastId = toast.loading("Mise à jour...");
    try {
      await api.put(`/graphs/${id}/metadata`, {
        title: editTitle,
        description: editDesc,
        is_public: false,
      });
      setGraphDetails({ title: editTitle, description: editDesc });
      setIsSettingsModalOpen(false);
      toast.success("Informations mises à jour !", { id: toastId });
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.", { id: toastId });
    } finally {
      setIsUpdatingMeta(false);
    }
  };

  const handleSave = async () => {
    if (nodes.length === 0 && edges.length === 0)
      return toast.error("Le graphe est vide.");
    setIsSaving(true);
    const toastId = toast.loading("Sauvegarde en cours...");
    try {
      await api.post(`/graphs/${id}/save`, { nodes, edges });
      toast.success("Modifications enregistrées !", { id: toastId });
    } catch (err) {
      toast.error("Erreur de sauvegarde.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSpecificPassage = async () => {
    if (
      !selectedBook ||
      !selectedChapter ||
      !verseStart ||
      !verseEnd ||
      !reactFlowInstance
    )
      return;
    setLoading(true);
    try {
      const res = await api.get(
        `/nodes/fetch-passage/${selectedBook}/${selectedChapter}/${verseStart}/${verseEnd}`,
      );
      const center = reactFlowInstance.project({
        x: window.innerWidth / 2 - (isMobile ? 150 : 200),
        y: window.innerHeight / 2 - 100,
      });
      const newNode = {
        id: `passage-${Date.now()}`,
        type: "default",
        position: center,
        data: { label: `📖 ${res.data.reference}\n${res.data.text}` },
        style: {
          background: "#ffffff",
          color: "#1e293b",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          padding: "15px",
          fontWeight: "500",
          textAlign: "center",
          minWidth: 280,
          maxWidth: isMobile ? 300 : 400,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          whiteSpace: "pre-wrap",
          fontSize: isMobile ? "14px" : "16px",
        },
      };
      setNodes((nds) => [...nds, newNode]);
      if (isMobile) closeSidebar();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Passage introuvable !");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!reactFlowInstance) return;
    const center = reactFlowInstance.project({
      x: window.innerWidth / 2 - (isMobile ? 100 : 150),
      y: window.innerHeight / 2 - 50,
    });
    const newNote = {
      id: `note-${Date.now()}`,
      type: "note",
      position: center,
      data: { text: "" },
    };
    setNodes((nds) => [...nds, newNote]);
    if (isMobile) closeSidebar();
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  // On renvoie tout ce dont l'interface aura besoin
  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setReactFlowInstance,
    graphDetails,
    isSaving,
    handleSave,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    editTitle,
    setEditTitle,
    editDesc,
    setEditDesc,
    isUpdatingMeta,
    handleUpdateMetadata,
    books,
    isBooksLoading,
    selectedBook,
    setSelectedBook,
    selectedChapter,
    setSelectedChapter,
    verseStart,
    setVerseStart,
    verseEnd,
    setVerseEnd,
    loading,
    handleAddSpecificPassage,
    handleAddNote,
  };
}
