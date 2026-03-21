// Skeleton pour une carte de graphe dans le Dashboard
export const GraphCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse flex flex-col gap-3">
    <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div> {/* Titre */}
    <div className="h-4 bg-slate-100 rounded-lg w-full"></div>{" "}
    {/* Desc ligne 1 */}
    <div className="h-4 bg-slate-100 rounded-lg w-5/6"></div>{" "}
    {/* Desc ligne 2 */}
    <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-50">
      <div className="h-3 bg-slate-100 rounded w-20"></div> {/* Ouvrir */}
      <div className="h-4 bg-slate-100 rounded-full w-4"></div> {/* Icon */}
    </div>
  </div>
);

// Skeleton pour la liste des livres dans la sidebar de l'Éditeur
export const BooksLoaderSkeleton = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
  </div>
);
