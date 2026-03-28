import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "@/services/api";
import { Loader2 } from "lucide-react";

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    // On vérifie auprès du backend si le token appartient bien à un superadmin
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data.role === "superadmin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => setIsAdmin(false));
  }, []);

  // Le temps que le backend réponde
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  // Si c'est un admin on affiche la page, sinon on le jette sur le dashboard
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
