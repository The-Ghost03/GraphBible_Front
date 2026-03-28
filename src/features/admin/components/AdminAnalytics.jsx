import { Users, Database, Zap, Heart, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
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
      icon: Zap,
      color: "text-blue-600",
    },
    {
      label: "Stickiness (DAU/MAU)",
      value: `${analytics.stickiness}%`,
      icon: Heart,
      color: "text-emerald-600",
    },
    {
      label: "Rétention S1",
      value: `${analytics.retention_rate_w1}%`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      label: "Noeuds par Étude",
      value: analytics.avg_nodes_per_graph,
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
    <div className="space-y-8">
      {/* KPIs FLASH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white p-5 rounded-2xl border border-slate-300 shadow-md"
            >
              <div
                className={`flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-xs ${kpi.color}`}
              >
                <Icon size={16} /> {kpi.label}
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {kpi.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRAPHIQUE 1 : LOGINS JOURNALIERS (Area) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">
            Utilisateurs actifs journaliers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.activity_trend}>
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).getDate()}
                stroke="#94a3b8"
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                content={<CustomTooltip />}
              />
              <Area
                type="monotone"
                dataKey="logins"
                name="Utilisateurs"
                stroke="#2563eb"
                fill="#dbeafe"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHIQUE 2 : CRÉATIONS (Bar) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">
            Nouvelles études et Noeuds
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.creation_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).getDate()}
                stroke="#94a3b8"
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                content={<CustomTooltip />}
              />
              <Legend iconType="circle" />
              <Bar
                dataKey="graphs_created"
                name="Graphes"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="nodes_created"
                name="Noeuds"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRAPHIQUE 3 : CUMUL INSCRIPTIONS (Line) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md lg:col-span-2">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">
            Inscriptions cumulées (30 jours)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.registration_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).getDate()}
                stroke="#94a3b8"
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="registrations"
                name="Inscrits"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP USERS LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md">
          <h3 className="text-lg font-extrabold text-slate-900 mb-5 text-blue-700">
            🏆 Top Power Users
          </h3>
          <div className="space-y-4">
            {analytics.top_power_users.map((user, i) => (
              <div
                key={user.email}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    #{i + 1} {user.name}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <div className="text-2xl font-extrabold text-blue-600">
                  {user.score} noeuds
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-md">
          <h3 className="text-lg font-extrabold text-slate-900 mb-5 text-red-700">
            📉 Risques de Churn (Inactifs +20 noeuds)
          </h3>
          <div className="space-y-4">
            {analytics.top_churn_risks.map((user) => (
              <div
                key={user.email}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-red-100"
              >
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <div className="text-2xl font-extrabold text-red-600">
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
