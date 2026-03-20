import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import GraphEditor from "../pages/GraphEditor";
import PrivateRoute from "../shared/components/PrivateRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/graph/:id"
        element={
          <PrivateRoute>
            <GraphEditor />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}
