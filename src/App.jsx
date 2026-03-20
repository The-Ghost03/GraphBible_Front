import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import GraphEditor from "./pages/GraphEditor";

// Composant pour protéger les pages privées
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        {/* La route du Dashboard connectée au vrai composant */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Route temporaire pour l'éditeur (on la codera juste après) */}
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
    </Router>
  );
}
