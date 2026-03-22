import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";

// --- Imports Shadcn/ui ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
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
        const res = await api.post("/auth/login", { email, password });
        setToken(res.data.access_token);
        toast.success("Content de te revoir !");
        navigate("/dashboard");
      } else {
        if (step === 1) {
          await api.post("/auth/register", { email, password });
          setStep(2);
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
    <div className="min-h-screen bg-white flex font-sans">
      {/* CÔTÉ GAUCHE : Décoratif */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center p-12 lg:p-24 text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 flex items-center gap-3">
            BibleGraph <span className="text-blue-500">🌿</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
            Plongez au cœur des Écritures. Visualisez, connectez et étudiez les
            versets comme jamais auparavant.
          </p>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-400 bg-white/5 w-fit px-4 py-2.5 rounded-full border border-white/10">
            <ShieldCheck className="text-emerald-400" size={18} />
            Espace d'étude privé et sécurisé.
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : Le Formulaire Épuré */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : step === 1 ? "register" : "otp"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full max-w-sm"
          >
            {/* EN-TÊTE DU FORMULAIRE */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                {isLogin
                  ? "Bienvenue"
                  : step === 1
                    ? "Créer un compte"
                    : "Vérification"}
              </h2>
              <p className="text-slate-500 text-sm">
                {isLogin
                  ? "Connectez-vous pour retrouver vos études."
                  : step === 1
                    ? "Rejoignez-nous en quelques secondes."
                    : `Un code a été envoyé à ${email}`}
              </p>
            </div>

            {/* CORPS DU FORMULAIRE */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-medium"
                    >
                      Adresse e-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nom@exemple.com"
                        className="h-12 pl-11 bg-slate-50 border-slate-200 rounded-xl hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-colors text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-slate-700 font-medium"
                      >
                        Mot de passe
                      </Label>
                      {/* Petit lien "Mot de passe oublié" optionnel pour le style */}
                      {isLogin && (
                        <a
                          href="#"
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Oublié ?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 pl-11 bg-slate-50 border-slate-200 rounded-xl hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-colors text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ÉTAPE 2 : COMPOSANT INPUT OTP SHADCN */}
              {step === 2 && !isLogin && (
                <div className="space-y-3 flex flex-col items-center sm:items-start py-2">
                  <Label className="text-slate-700 font-medium">
                    Code à 6 chiffres
                  </Label>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="h-12 w-10 sm:w-12 border-slate-300 rounded-l-xl text-lg"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-12 w-10 sm:w-12 border-slate-300 text-lg"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-12 w-10 sm:w-12 border-slate-300 text-lg"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator className="text-slate-300" />
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={3}
                        className="h-12 w-10 sm:w-12 border-slate-300 text-lg"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-12 w-10 sm:w-12 border-slate-300 text-lg"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-12 w-10 sm:w-12 border-slate-300 rounded-r-xl text-lg"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70"
                disabled={isLoading || (step === 2 && otp.length < 6)}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isLogin
                  ? "Se connecter"
                  : step === 1
                    ? "Créer mon compte"
                    : "Valider mon compte"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            {/* LIEN D'INSCRIPTION / CONNEXION */}
            {step === 1 && (
              <div className="mt-8 text-center sm:text-left text-sm text-slate-500">
                {isLogin
                  ? "Nouveau sur BibleGraph ?"
                  : "Vous avez déjà un compte ?"}
                <button
                  className="text-blue-600 font-semibold ml-1.5 hover:underline transition-all outline-none"
                  disabled={isLoading}
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setOtp("");
                    setPassword("");
                  }}
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
