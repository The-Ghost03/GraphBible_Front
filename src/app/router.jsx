import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import GraphEditor from "../pages/GraphEditor";
import Profile from "../pages/Profile";
import AdminRoute from "../shared/components/AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
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
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
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
