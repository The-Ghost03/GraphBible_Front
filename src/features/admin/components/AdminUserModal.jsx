import { X, Ban, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUserModal({
  user,
  onClose,
  onToggleBan,
  onDeleteUser,
  isProcessing,
}) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-slate-500 text-sm">{user.email}</p>
          <div className="flex gap-2 mt-3">
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">
              Créé le {new Date(user.created_at).toLocaleDateString()}
            </span>
            {user.is_banned && (
              <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold border border-red-200">
                Banni
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          {user.role !== "superadmin" ? (
            <>
              <Button
                onClick={() => onToggleBan(user.id)}
                disabled={isProcessing}
                className={`w-full justify-start cursor-pointer font-bold ${user.is_banned ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200" : "bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 border border-orange-200"}`}
                variant="outline"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Ban size={18} className="mr-3" />
                )}
                {user.is_banned ? "Réactiver l'accès" : "Bannir l'utilisateur"}
              </Button>

              <Button
                onClick={() => onDeleteUser(user.id)}
                disabled={isProcessing}
                className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 cursor-pointer font-bold"
                variant="outline"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Trash2 size={18} className="mr-3" />
                )}
                Supprimer définitivement
              </Button>
            </>
          ) : (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Action impossible (Super Admin)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
