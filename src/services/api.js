import axios from "axios";

const API_URL = "http://161.97.105.109:8070"; // L'IP de ton serveur

const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur : Ajoute le token JWT à chaque requête automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
