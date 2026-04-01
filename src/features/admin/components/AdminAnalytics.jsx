import { Users, Database, Zap, Heart, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminAnalytics({ analytics, loading }) {
  if (loading || !analytics)
    return (
      <div className="text-center p-10 text-slate-500">
        Chargement de l'analytics...
      </div>
    );

  const kpis = [
    {
      label: "DAU (Actifs 24h)",
      value: analytics.active_users_daily,
      desc: "Comptes connectés aujourd'hui.",
      icon: Zap,
      color: "text-blue-600",
    },
    {
      label: "Stickiness (DAU/MAU)",
      value: `${analytics.stickiness}%`,
      desc: "% des utilisateurs mensuels connectés aujourd'hui.",
      icon: Heart,
      color: "text-emerald-600",
    },
    {
      label: "Rétention S1",
      value: `${analytics.retention_rate_w1}%`,
      desc: "Inscrits il y a 7 jours revenus aujourd'hui.",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      label: "Noeuds par Étude",
      value: analytics.avg_nodes_per_graph,
      desc: "Moyenne d'éléments créés par graphe.",
      icon: Database,
      color: "text-amber-600",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg">
          <p className="text-xs text-slate-500 mb-1">
            {new Date(label).toLocaleDateString()}
          </p>
          {payload.map((p) => (
            <p
              key={p.name}
              className={`font-bold ${p.name === "Noeuds" ? "text-purple-600" : "text-emerald-600"}`}
            >
              {p.value} {p.name}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 🚀 KPIs FLASH (Style Carte fine Zoho) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
            >
              <div
                className={`flex items-center gap-2 mb-3 font-semibold text-[11px] uppercase tracking-wider ${kpi.color}`}
              >
                <Icon size={14} /> {kpi.label}
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {kpi.value}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {kpi.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPHIQUE 1 : LOGINS JOURNALIERS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Utilisateurs actifs journaliers
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.activity_trend}>
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).getDate()}
                stroke="#cbd5e1"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="#cbd5e1"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                content={<CustomTooltip />}
              />
              <Area
                type="monotone"
                dataKey="logins"
                name="Utilisateurs"
                stroke="#2563eb"
                fill="#eff6ff"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHIQUE 2 : CRÉATIONS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Nouvelles études et Noeuds
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.creation_trend}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).getDate()}
                stroke="#cbd5e1"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="#cbd5e1"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                content={<CustomTooltip />}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="graphs_created"
                name="Graphes"
                fill="#10b981"
                radius={[3, 3, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="nodes_created"
                name="Noeuds"
                fill="#8b5cf6"
                radius={[3, 3, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHIQUE 3 : CUMUL INSCRIPTIONS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Inscriptions cumulées (30 jours)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.registration_trend}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).getDate()}
                stroke="#cbd5e1"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="#cbd5e1"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="registrations"
                name="Inscrits"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP USERS LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700">
              🏆 Top Power Users
            </h3>
          </div>
          <div className="p-0">
            {analytics.top_power_users.map((user, i) => (
              <div
                key={user.email}
                className="flex justify-between items-center p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-800 text-sm">
                    #{i + 1} {user.name}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  {user.score} noeuds
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700">
              📉 Risques de Churn (Inactifs +20 noeuds)
            </h3>
          </div>
          <div className="p-0">
            {analytics.top_churn_risks.map((user) => (
              <div
                key={user.email}
                className="flex justify-between items-center p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-800 text-sm">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <div className="text-sm font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">
                  {user.score} noeuds
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
