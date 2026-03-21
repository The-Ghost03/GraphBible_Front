import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* On pourra mettre une barre de navigation globale ou un footer ici plus tard */}
      <main className="flex-1 overflow-hidden relative">
        <Outlet /> {/* C'est ici que s'afficheront le Dashboard ou l'Éditeur */}
      </main>
    </div>
  );
}
