import { lazy, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./app/router";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";

// Lazy-load Toaster pour éviter que l'init CSS de goober/react-hot-toast
// ne crashe avant le montage de React
const Toaster = lazy(() =>
  import("react-hot-toast").then((m) => ({ default: m.Toaster }))
);

const toastOptions = {
  duration: 4000,
  style: { background: "#1e293b", color: "#fff", borderRadius: "12px" },
  success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
  error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
};

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppRouter />
        <Suspense fallback={null}>
          <Toaster position="top-right" toastOptions={toastOptions} />
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}
