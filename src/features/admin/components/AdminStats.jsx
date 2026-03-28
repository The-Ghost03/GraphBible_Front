import { Users, Database, Activity } from "lucide-react";

export default function AdminStats({ stats, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3 text-blue-600 mb-2 font-bold uppercase tracking-wider text-xs">
          <Users size={18} /> Inscrits
        </div>
        <div className="text-3xl font-extrabold text-slate-900">
          {loading ? "..." : stats.total_users}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3 text-emerald-600 mb-2 font-bold uppercase tracking-wider text-xs">
          <Database size={18} /> Études Créées
        </div>
        <div className="text-3xl font-extrabold text-slate-900">
          {loading ? "..." : stats.total_graphs}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3 text-purple-600 mb-2 font-bold uppercase tracking-wider text-xs">
          <Activity size={18} /> Noeuds Générés
        </div>
        <div className="text-3xl font-extrabold text-slate-900">
          {loading ? "..." : stats.total_nodes}
        </div>
      </div>
    </div>
  );
}
