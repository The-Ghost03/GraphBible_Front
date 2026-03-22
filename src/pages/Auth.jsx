import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  KeyRound,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- LOGIQUE CONNEXION ---
        const res = await api.post("/auth/login", { email, password });
        setToken(res.data.access_token);
        toast.success("Content de te revoir !");
        navigate("/dashboard");
      } else {
        // --- LOGIQUE INSCRIPTION ---
        if (step === 1) {
          await api.post("/auth/register", { email, password });
          setStep(2); // On glisse vers la page OTP
          toast.success("Code envoyé ! Vérifiez votre boîte mail.");
        } else {
          await api.post("/auth/verify-otp", { email, otp });
          toast.success("Compte vérifié ! Vous pouvez vous connecter.");
          setIsLogin(true);
          setStep(1);
          setOtp("");
          setPassword("");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* CÔTÉ GAUCHE : Décoratif (Caché sur mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-center p-12 text-white">
        {/* Cercles décoratifs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            BibleGraph <span className="text-blue-500">🌿</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Plongez au cœur des Écritures. Visualisez, connectez et étudiez les
            versets comme jamais auparavant.
          </p>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
            <ShieldCheck className="text-emerald-400" size={20} />
            Espace d'étude privé et sécurisé.
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : Le Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin
                ? "Bienvenue"
                : step === 1
                  ? "Créer un compte"
                  : "Vérification"}
            </h2>
            <p className="text-slate-500">
              {isLogin
                ? "Connectez-vous pour retrouver vos études."
                : step === 1
                  ? "Rejoignez-nous en quelques secondes."
                  : `Un code a été envoyé à ${email}`}
            </p>
          </div>

          {/* Wrapper d'animation pour fluidifier les changements */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : step === 1 ? "register" : "otp"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* CHAMP EMAIL */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={step === 2 || isLoading}
                  required
                />
              </div>

              {/* CHAMP MOT DE PASSE */}
              {step === 1 && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              {/* CHAMP OTP (S'affiche uniquement à l'étape 2) */}
              {step === 2 && !isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Code à 6 chiffres"
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700 text-center tracking-[0.5em] font-bold text-xl"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              {/* BOUTON SOUMISSION */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed overflow-hidden mt-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isLogin
                      ? "Se connecter"
                      : step === 1
                        ? "Créer mon compte"
                        : "Valider mon compte"}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* LIEN DE BASCULE (Connexion / Inscription) */}
          {step === 1 && (
            <div className="mt-8 text-center text-sm text-slate-500">
              {isLogin
                ? "Nouveau sur BibleGraph ?"
                : "Vous avez déjà un compte ?"}
              <button
                className="text-blue-600 font-bold ml-1.5 hover:text-blue-800 transition-colors"
                disabled={isLoading}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setOtp("");
                  setPassword("");
                }}
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
