import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import App from "./App.jsx";
import "./index.css";

// ── Sentry (actif si VITE_SENTRY_DSN est défini) ─────────────────────────────
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.browserTracingIntegration()],
  });
}

// ── Service Worker ─────────────────────────────────────────────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

// ── TanStack Query ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const root = createRoot(document.getElementById("root"));

// Sentry enveloppe l'app pour capturer les erreurs React si DSN configuré
const AppWithProviders = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

root.render(
  import.meta.env.VITE_SENTRY_DSN
    ? <Sentry.ErrorBoundary fallback={<p>Une erreur critique est survenue.</p>}>{AppWithProviders}</Sentry.ErrorBoundary>
    : AppWithProviders
);
