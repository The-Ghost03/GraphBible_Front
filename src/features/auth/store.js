import { create } from "zustand";

export const useAuthStore = create((set) => ({
  // Au démarrage, on va chercher s'il y a déjà un token enregistré
  token: localStorage.getItem("token"),

  // Fonction pour se connecter
  setToken: (newToken) => {
    localStorage.setItem("token", newToken); // On sauvegarde physiquement
    set({ token: newToken }); // On prévient tout React !
  },

  // Fonction pour se déconnecter
  logout: () => {
    localStorage.removeItem("token"); // On efface physiquement
    set({ token: null }); // On prévient tout React !
  },
}));
