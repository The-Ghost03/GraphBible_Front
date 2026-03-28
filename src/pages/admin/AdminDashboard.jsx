import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, RefreshCw, Send, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import api from "@/services/api";
import toast from "react-hot-toast";

// 🚀 NOUVEAUX CHEMINS D'IMPORTATION VERS FEATURES
import AdminStats from "@/features/admin/components/AdminStats";
import AdminUserList from "@/features/admin/components/AdminUserList";
import AdminUserModal from "@/features/admin/components/AdminUserModal";
import AdminMailing from "@/features/admin/components/AdminMailing";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState("users"); // 'users' ou 'mailing'

  // Données globales
  const [stats, setStats] = useState({
    total_users: 0,
    total_graphs: 0,
    total_nodes: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // État Modale
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
    } catch (err) {
      toast.error("Erreur de récupération des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // --- ACTIONS (Passées à la modale) ---
  const handleToggleBan = async (userId) => {
    setIsProcessingAction(true);
    try {
      const res = await api.put(`/admin/users/${userId}/ban`);
      toast.success(res.data.message);
      setSelectedUser(null);
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Êtes-vous sûr ? Cette action est IRRÉVERSIBLE."))
      return;
    setIsProcessingAction(true);
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      toast.success(res.data.message);
      setSelectedUser(null);
      fetchAdminData();
    } catch (err) {
      toast.error("Erreur de suppression");
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 md:p-10 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight text-slate-900">
            <ShieldCheck className="text-blue-600" size={32} /> Administration
          </h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
              <span className="hidden sm:inline">Rafraîchir</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-sm font-bold rounded-xl transition-colors border border-red-100 cursor-pointer"
            >
              <LogOut size={16} />{" "}
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* COMPOSANT STATS */}
        <AdminStats stats={stats} loading={loading} />

        {/* ONGLETS */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl border border-slate-200 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "users" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Users size={16} /> Base Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab("mailing")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "mailing" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Send size={16} /> Campagnes E-mail
          </button>
        </div>

        {/* CONTENU */}
        {activeTab === "users" ? (
          <AdminUserList
            users={users}
            loading={loading}
            onSelectUser={setSelectedUser}
          />
        ) : (
          <AdminMailing />
        )}

        {/* MODALE D'ACTION */}
        <AdminUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleBan={handleToggleBan}
          onDeleteUser={handleDeleteUser}
          isProcessing={isProcessingAction}
        />
      </div>
    </div>
  );
}
