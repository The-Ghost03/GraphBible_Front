import {
  ShieldCheck,
  MailX,
  Ban,
  Database,
  Clock,
  MoreHorizontal,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUserList({
  users,
  analytics,
  loading,
  onSelectUser,
}) {
  if (loading)
    return (
      <div className="text-center p-10 text-slate-500">
        Chargement des utilisateurs...
      </div>
    );

  const totalUsers = users.length;
  const totalGraphs = users.reduce(
    (sum, user) => sum + (user.total_graphs || 0),
    0,
  );
  const activeUsers = users.filter((u) => u.is_verified && !u.is_banned).length;
  const totalNodes = analytics?.total_nodes || 0;

  return (
    <div className="space-y-6">
      {/* 🚀 GRILLE DES KPIS (Style Zoho) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Inscrits
            </span>
            <Users size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalUsers}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Études Créées
            </span>
            <Database size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalGraphs}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Noeuds Générés
            </span>
            <Activity size={16} className="text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalNodes}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Comptes Actifs
            </span>
            <ShieldCheck size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{activeUsers}</div>
        </div>
      </div>

      {/* 🚀 LE TABLEAU DES UTILISATEURS (Style Zoho) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="text-sm font-bold text-slate-800">
            Détail des Utilisateurs
          </h2>
        </div>

        <div className="overflow-x-auto">
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
              {users.map((user) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
