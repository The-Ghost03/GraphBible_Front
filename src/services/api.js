import axios from "axios";
import { useAuthStore } from "@/features/auth/store"; // 🚀 Import de ton store Zustand
import toast from "react-hot-toast";

// L'URL de ton API (Garde celle qui marche pour toi, "/api" ou l'URL complète)
const API_URL = "https://biblegraphe.softskills.ci/api";

const api = axios.create({
  baseURL: API_URL,
});

// --- INTERCEPTEUR DE REQUÊTE ---
// Ajoute le token JWT à chaque requête automatiquement
api.interceptors.request.use((config) => {
  // On récupère le token depuis le store (ou le localStorage en secours)
  const token = useAuthStore.getState().token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 🚀 INTERCEPTEUR DE RÉPONSE ---
// Gère l'expiration de session globalement
api.interceptors.response.use(
  (response) => {
    // Si la requête réussit, on renvoie simplement la réponse
    return response;
  },
  (error) => {
    // Si l'erreur est 401 (Non Autorisé / Token expiré)
    if (error.response && error.response.status === 401) {
      // 1. On vide proprement le store Zustand
      useAuthStore.getState().logout();

      // 2. Sécurité : on nettoie aussi le localStorage au cas où
      localStorage.removeItem("token");

      // 3. Petit message pour prévenir l'utilisateur
      toast.error("Votre session a expiré. Veuillez vous reconnecter.");

      // 4. Redirection forcée vers la page de connexion
      // On utilise window.location.href pour être sûr de vider la mémoire React (le cache)
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
