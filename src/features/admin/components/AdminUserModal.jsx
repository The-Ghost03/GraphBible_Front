import { useState, useEffect } from "react";
import { X, Ban, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminUserModal({
  user,
  onClose,
  onToggleBan,
  onDeleteUser,
  processingAction, // 'ban' | 'delete' | null
}) {
  // 🚀 État local pour afficher la confirmation de suppression
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Réinitialiser la vue de confirmation si on change d'utilisateur
  useEffect(() => {
    setShowConfirmDelete(false);
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* 🚀 VUE 1 : DÉTAILS ET ACTIONS CLASSIQUES */}
        {!showConfirmDelete ? (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <div className="flex gap-2 mt-4">
                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                  Inscrit le {new Date(user.created_at).toLocaleDateString()}
                </span>
                {user.is_banned && (
                  <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                    Banni
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-5 border-t border-slate-100">
              {user.role !== "superadmin" ? (
                <>
                  <Button
                    onClick={() => onToggleBan(user.id)}
                    disabled={processingAction !== null}
                    className={`w-full justify-start cursor-pointer font-bold shadow-sm ${
                      user.is_banned
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200"
                    }`}
                    variant="outline"
                  >
                    {processingAction === "ban" ? (
                      <Loader2 className="animate-spin mr-3" size={18} />
                    ) : (
                      <Ban size={18} className="mr-3" />
                    )}
                    {user.is_banned
                      ? "Réactiver l'accès"
                      : "Bannir l'utilisateur"}
                  </Button>

                  <Button
                    onClick={() => setShowConfirmDelete(true)} // Bascule sur la vue 2
                    disabled={processingAction !== null}
                    className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer font-bold shadow-sm"
                    variant="outline"
                  >
                    <Trash2 size={18} className="mr-3" /> Supprimer
                    définitivement
                  </Button>
                </>
              ) : (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    Un Super Admin ne peut pas être modifié
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* 🚀 VUE 2 : CONFIRMATION ÉLÉGANTE DE SUPPRESSION */
          <div className="py-2 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Supprimer ce compte ?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Cette action est irréversible. Toutes les études de{" "}
              <span className="font-semibold text-slate-700">
                {user.first_name}
              </span>{" "}
              seront détruites.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 cursor-pointer font-bold border-slate-200"
                disabled={processingAction === "delete"}
              >
                Annuler
              </Button>
              <Button
                onClick={() => onDeleteUser(user.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer font-bold shadow-sm"
                disabled={processingAction === "delete"}
              >
                {processingAction === "delete" ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : null}
                Oui, supprimer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
