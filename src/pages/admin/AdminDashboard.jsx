import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Users,
  RefreshCw,
  Send,
  ShieldCheck,
  PieChart,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import api from "@/services/api";
import toast from "react-hot-toast";

import AdminStats from "@/features/admin/components/AdminStats";
import AdminUserList from "@/features/admin/components/AdminUserList";
import AdminUserModal from "@/features/admin/components/AdminUserModal";
import AdminMailing from "@/features/admin/components/AdminMailing";
import AdminAnalytics from "@/features/admin/components/AdminAnalytics"; // 🚀 Import du nouveau composant

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState("analytics"); // 🚀 On active l'onglet Analytics par défaut

  // Données globales
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // 🚀 Nouvel état pour les analytics avancées
  const [analytics, setAnalytics] = useState(null);

  // État Modale
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/analytics"), // 🚀 On tape sur la nouvelle route advanced
      ]);
      setUsers(usersRes.data.users);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      toast.error("Erreur de récupération des données d'administration.");
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

  // --- ACTIONS MODALE ---
  const handleToggleBan = async (userId) => {
    setIsProcessingAction(true);
    try {
      const res = await api.put(`/admin/users/${userId}/ban`);
      toast.success(res.data.message);
      setSelectedUser(null);
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de l'action.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ? (Action irréversible)",
      )
    )
      return;
    setIsProcessingAction(true);
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      toast.success(res.data.message);
      setSelectedUser(null);
      fetchAdminData();
    } catch (err) {
      toast.error("Impossible de supprimer l'utilisateur.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-6 md:p-10 pb-20">
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
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm cursor-pointer active:scale-95"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
              <span className="hidden sm:inline">Rafraîchir données</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-sm font-bold rounded-xl transition-all border border-red-100 cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut size={16} />{" "}
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* ONGLETS */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl border border-slate-300 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "analytics" ? "bg-slate-100 text-slate-900 shadow-inner" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
          >
            <PieChart size={16} /> Analytiques
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "users" ? "bg-slate-100 text-slate-900 shadow-inner" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
          >
            <Users size={16} /> Base Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab("mailing")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "mailing" ? "bg-slate-100 text-slate-900 shadow-inner" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
          >
            <Send size={16} /> Campagnes E-mail
          </button>
        </div>

        {/* CONTENU DYNAMIQUE */}
        {activeTab === "analytics" && (
          <AdminAnalytics analytics={analytics} loading={loading} />
        )}
        {activeTab === "users" && (
          <AdminUserList
            users={users}
            analytics={analytics}
            loading={loading}
            onSelectUser={setSelectedUser}
          />
        )}
        {activeTab === "mailing" && <AdminMailing />}

        {/* MODALE D'ACTION UTILISATEUR */}
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
