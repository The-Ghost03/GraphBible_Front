import {
  ShieldCheck,
  MailX,
  Ban,
  Database,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUserList({ users, loading, onSelectUser }) {
  if (loading)
    return (
      <div className="text-center p-10 text-slate-500">
        Chargement des utilisateurs...
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
      {/* VUE MOBILE (Cartes) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-5 flex flex-col gap-3 active:bg-slate-50 cursor-pointer"
            onClick={() => onSelectUser(user)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-slate-900">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
              {user.is_banned && (
                <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-[10px] font-bold border border-red-100">
                  BANNI
                </span>
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Database size={14} className="text-slate-400" />{" "}
                {user.total_graphs} études
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-slate-400" />{" "}
                {user.last_login
                  ? new Date(user.last_login).toLocaleDateString()
                  : "Jamais"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* VUE PC (Tableau) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4 text-center">Statut</th>
              <th className="px-6 py-4 text-center">Dernière Connexion</th>
              <th className="px-6 py-4 text-center">Études</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`hover:bg-slate-50 transition-colors ${user.is_banned ? "opacity-60 bg-slate-50" : ""}`}
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    {user.first_name} {user.last_name}
                    {user.role === "superadmin" && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <Ban size={12} /> Banni
                    </span>
                  ) : user.is_verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <ShieldCheck size={12} /> Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                      <MailX size={12} /> En attente
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-slate-500 font-medium">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : "Jamais"}
                </td>
                <td className="px-6 py-4 text-center font-bold text-blue-600">
                  {user.total_graphs}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectUser(user)}
                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                  >
                    <MoreVertical size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
