import { useCallback, useRef, useReducer } from "react";

const MAX_HISTORY = 50;

/**
 * Hook undo/redo pour ReactFlow.
 * takeSnapshot  → sauvegarde l'état actuel
 * undo()        → retourne le snapshot précédent (null si impossible)
 * redo()        → retourne le snapshot suivant  (null si impossible)
 */
export function useUndoRedo() {
  const history  = useRef([]); // tableau de { nodes, edges }
  const position = useRef(-1); // index courant dans l'historique
  const [, rerender] = useReducer((x) => x + 1, 0);

  const takeSnapshot = useCallback((nodes, edges) => {
    // Supprime tout ce qui est "dans le futur" (après undo)
    const trimmed = history.current.slice(0, position.current + 1);
    trimmed.push({
      nodes: nodes.map((n) => ({ ...n, position: { ...n.position } })),
      edges: edges.map((e) => ({ ...e })),
    });
    history.current = trimmed.slice(-MAX_HISTORY);
    position.current = history.current.length - 1;
    rerender();
  }, []);

  const undo = useCallback(() => {
    if (position.current <= 0) return null;
    position.current -= 1;
    rerender();
    return history.current[position.current];
  }, []);

  const redo = useCallback(() => {
    if (position.current >= history.current.length - 1) return null;
    position.current += 1;
    rerender();
    return history.current[position.current];
  }, []);

  return {
    takeSnapshot,
    undo,
    redo,
    canUndo: position.current > 0,
    canRedo: position.current < history.current.length - 1,
  };
}
