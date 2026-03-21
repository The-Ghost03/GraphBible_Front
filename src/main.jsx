import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1, // 🔄 L'app essaiera 1 fois de plus en cas d'échec réseau
      onError: (error) => {
        // 🚨 Gestion globale des erreurs (On pourra y brancher un Toast/Notification plus tard)
        console.error("Erreur API Globale :", error.message);
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
