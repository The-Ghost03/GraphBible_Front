import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Trash2,
  ArrowLeft,
  Save,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";

export default function Profile() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // États du profil
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: "",
    email: "",
  });

  // États du mot de passe
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
  });

  // 🚀 États pour la Modale de Suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Chargement initial
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) =>
        setProfile({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          phone: res.data.phone || "",
          birth_date: res.data.birth_date || "",
          email: res.data.email || "",
        }),
      )
      .catch(() => toast.error("Impossible de charger le profil"))
      .finally(() => setLoading(false));
  }, []);

  // --- ACTIONS ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put("/auth/me", profile);
      toast.success("Profil mis à jour !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current_password || !passwords.new_password) return;
    setSavingPassword(true);
    try {
      await api.put("/auth/me/password", passwords);
      toast.success("Mot de passe modifié !");
      setPasswords({ current_password: "", new_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur de mot de passe");
    } finally {
      setSavingPassword(false);
    }
  };

  // 🚀 La nouvelle fonction pour la suppression définitive
  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete("/auth/me");
      toast.success("Compte supprimé avec succès.");
      logout();
      navigate("/auth");
    } catch (err) {
      toast.error("Impossible de supprimer le compte");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            Mon Profil
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          {/* SECTION 1 : Infos Personnelles */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="text-blue-500" /> Informations Personnelles
            </h2>
            <form
              onSubmit={handleUpdateProfile}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.first_name}
                    onChange={(e) =>
                      setProfile({ ...profile, first_name: e.target.value })
                    }
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.last_name}
                    onChange={(e) =>
                      setProfile({ ...profile, last_name: e.target.value })
                    }
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="+33 6..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.birth_date}
                    onChange={(e) =>
                      setProfile({ ...profile, birth_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Adresse E-mail (Non modifiable)
                </label>
                <input
                  type="email"
                  disabled
                  className="w-full border border-slate-200 bg-slate-100 text-slate-500 p-3 rounded-xl cursor-not-allowed"
                  value={profile.email}
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="mt-2 self-end flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-md disabled:bg-blue-400 cursor-pointer"
              >
                {savingProfile ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}{" "}
                Enregistrer
              </button>
            </form>
          </div>

          {/* SECTION 2 : Sécurité (Mot de passe) */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock className="text-emerald-500" /> Sécurité
            </h2>
            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  value={passwords.current_password}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      current_password: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  className="w-full border border-slate-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new_password: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="mt-2 self-end flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-md disabled:bg-emerald-400 cursor-pointer"
              >
                {savingPassword ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}{" "}
                Modifier le mot de passe
              </button>
            </form>
          </div>

          {/* SECTION 3 : Zone de danger */}
          <div className="bg-red-50 p-6 md:p-8 rounded-2xl shadow-sm border border-red-200 mt-4">
            <h2 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
              <ShieldAlert size={24} /> Zone de danger
            </h2>
            <p className="text-red-600 text-sm mb-6">
              La suppression de votre compte effacera définitivement toutes vos
              études, noeuds et données personnelles. Cette action est
              irréversible.
            </p>
            <button
              onClick={() => setIsDeleteModalOpen(true)} // 🚀 ON OUVRE LA MODALE
              className="flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition shadow-md cursor-pointer"
            >
              <Trash2 size={18} /> Supprimer mon compte
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 MODALE DE SUPPRESSION DE COMPTE */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Quitter BibleGraph ?
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
              Cette action effacera toutes vos études, noeuds et données
              personnelles. <strong>C'est irréversible.</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:bg-red-400 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Oui, supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
