import { useState, useEffect } from "react";
import {
  ShieldCheck,
  MailX,
  Ban,
  Database,
  Clock,
  MoreHorizontal,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUserList({
  users,
  analytics,
  loading,
  onSelectUser,
}) {
  // 🚀 PAGINATION LOCALE
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Calculer les pages
  const totalPages = Math.ceil(users.length / usersPerPage) || 1;

  // Sécuriser la page courante au cas où on supprime le dernier élément d'une page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [users.length, currentPage, totalPages]);

  // Découper le tableau pour n'afficher que les éléments de la page actuelle
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="space-y-6">
      {/* 🚀 GRILLE DES KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Inscrits
            </span>
            <Users size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {users.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Études Créées
            </span>
            <Database size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {users.reduce((sum, u) => sum + (u.total_graphs || 0), 0)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Noeuds Générés
            </span>
            <Activity size={16} className="text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analytics?.total_nodes || 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Comptes Actifs
            </span>
            <ShieldCheck size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {users.filter((u) => u.is_verified && !u.is_banned).length}
          </div>
        </div>
      </div>

      {/* 🚀 LE TABLEAU DES UTILISATEURS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* HEADER SIMPLE (Comme sur la capture d'écran) */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white">
          <h2 className="text-sm font-bold text-slate-800">
            Détail des Utilisateurs
          </h2>
        </div>

        {/* CONTENU DE LA TABLE */}
        <div className="overflow-x-auto relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
          )}

          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Utilisateur</th>
                <th className="px-6 py-3 text-center">Statut</th>
                <th className="px-6 py-3 text-center">Dernière Connexion</th>
                <th className="px-6 py-3 text-center">Études</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-slate-50 transition-colors group cursor-pointer ${user.is_banned ? "opacity-50" : ""}`}
                  onClick={() => onSelectUser(user)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      {user.first_name} {user.last_name}
                      {user.role === "superadmin" && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.is_banned ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold text-red-600">
                        <Ban size={12} /> Banni
                      </span>
                    ) : user.is_verified ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold text-emerald-600">
                        <ShieldCheck size={12} /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold text-orange-500">
                        <MailX size={12} /> En attente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500 text-xs">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "Jamais"}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">
                    {user.total_graphs}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-1.5 h-auto"
                    >
                      <MoreHorizontal size={18} />
                    </Button>
                  </td>
                </tr>
              ))}

              {!loading && currentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Aucun utilisateur inscrit pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🚀 PAGINATION VISIBLE SI PLUS D'UNE PAGE */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Page {currentPage} sur {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2 border-slate-200 text-slate-600 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 px-2 border-slate-200 text-slate-600 cursor-pointer"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
