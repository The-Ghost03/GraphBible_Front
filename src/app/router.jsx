import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "../pages/Auth";
import Landing from "../pages/Landing";
import PrivateRoute from "../shared/components/PrivateRoute";

// Lazy-load des pages lourdes (ReactFlow, recharts, TipTap, jsPDF…)
const Dashboard     = lazy(() => import("../pages/Dashboard"));
const GraphEditor   = lazy(() => import("../pages/GraphEditor"));
const Profile       = lazy(() => import("../pages/Profile"));
const AdminRoute    = lazy(() => import("../shared/components/AdminRoute"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

function PageLoader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" stroke="#1e293b" strokeWidth="4" fill="none"/>
        <path d="M22 4a18 18 0 0 1 18 18" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" fill="none">
          <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="0.75s" repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/auth"      element={<Auth />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/graph/:id" element={<PrivateRoute><GraphEditor /></PrivateRoute>} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
