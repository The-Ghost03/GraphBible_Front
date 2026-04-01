import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Users,
  RefreshCw,
  Send,
  ShieldCheck,
  PieChart,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import api from "@/services/api";
import toast from "react-hot-toast";

import AdminUserList from "@/features/admin/components/AdminUserList";
import AdminUserModal from "@/features/admin/components/AdminUserModal";
import AdminMailing from "@/features/admin/components/AdminMailing";
import AdminAnalytics from "@/features/admin/components/AdminAnalytics";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const adminEmail = useAuthStore((state) => state.email) || "Admin";

  const [activeModule, setActiveModule] = useState("analytics");

  // 🚀 Détecte la taille de l'écran au chargement : ouvert sur PC, fermé sur Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Données globales
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // État Modale
  const [selectedUser, setSelectedUser] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, analyticsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/analytics"),
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

    // Ajoute un écouteur pour gérer le redimensionnement de l'écran
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // --- ACTIONS MODALE ---
  const handleToggleBan = async (userId) => {
    setProcessingAction("ban");
    try {
      const res = await api.put(`/admin/users/${userId}/ban`);
      toast.success(res.data.message);
      setSelectedUser(null);
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de l'action.");
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setProcessingAction("delete");
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      toast.success(res.data.message);
      setSelectedUser(null);
      fetchAdminData();
    } catch (err) {
      toast.error("Impossible de supprimer l'utilisateur.");
    } finally {
      setProcessingAction(null);
    }
  };

  // 🚀 Fonction pour naviguer et fermer la sidebar sur mobile
  const handleNavigation = (moduleId) => {
    setActiveModule(moduleId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const sidebarMenu = [
    { id: "analytics", label: "Analytiques", icon: PieChart },
    { id: "users", label: "Base Utilisateurs", icon: Users },
    { id: "mailing", label: "Campagnes E-mail", icon: Send },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {/* 🚀 BACKDROP SOMBRE POUR MOBILE (Seulement visible si sidebar ouverte sur petit écran) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🚀 SIDEBAR RESPONSIVE */}
      <aside
        className={`
        fixed md:relative inset-y-0 left-0 z-40 bg-[#1e232d] text-slate-300 flex flex-col transition-all duration-300 shadow-2xl md:shadow-none shrink-0
        ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
        md:translate-x-0 md:${isSidebarOpen ? "w-60" : "w-16"}
      `}
      >
        <div className="h-14 flex items-center justify-between md:justify-center lg:justify-start px-4 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center">
            <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
            {/* Sur mobile, le texte est toujours visible car la largeur est à 64. Sur PC, ça dépend de isSidebarOpen */}
            <span
              className={`ml-3 font-semibold text-white tracking-wide text-lg ${!isSidebarOpen ? "md:hidden" : "block"}`}
            >
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center p-2.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span
                  className={`ml-3 text-sm font-medium ${!isSidebarOpen ? "md:hidden" : "block"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md w-full transition-colors cursor-pointer"
          >
            <LogOut size={20} className="shrink-0" />
            <span
              className={`ml-3 text-sm font-medium ${!isSidebarOpen ? "md:hidden" : "block"}`}
            >
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      {/* 🚀 ZONE DE CONTENU PRINCIPALE */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative z-10 w-full">
        {/* HEADER TOP-BAR */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-semibold text-slate-800 text-sm hidden sm:block">
              {sidebarMenu.find((m) => m.id === activeModule)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Rafraîchir</span>
            </button>
            <div className="h-5 w-px bg-slate-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0">
                {adminEmail.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENU SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeModule === "analytics" && (
              <AdminAnalytics analytics={analytics} loading={loading} />
            )}
            {activeModule === "users" && (
              <AdminUserList
                users={users}
                analytics={analytics}
                loading={loading}
                onSelectUser={setSelectedUser}
                onRefresh={fetchAdminData}
              />
            )}
            {activeModule === "mailing" && <AdminMailing />}
          </div>
        </main>
      </div>

      {/* MODALE D'ACTION */}
      <AdminUserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleBan={handleToggleBan}
        onDeleteUser={handleDeleteUser}
        processingAction={processingAction}
      />
    </div>
  );
}
