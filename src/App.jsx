import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/Auth";

// Un petit composant pour protéger les pages privées
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        {/* On protégera le Dashboard et l'Editeur derrière cette route plus tard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="flex items-center justify-center h-screen text-2xl font-bold text-slate-700">
                Bienvenue sur ton Tableau de bord ! 🎉
              </div>
            </PrivateRoute>
          }
        />

        {/* Par défaut, on renvoie vers l'authentification */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}
