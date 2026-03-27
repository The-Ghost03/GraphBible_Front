import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";

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
  // Modes : "login" | "register" | "forgot"
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1); // Étape 1 (Email/Mdp) ou Étape 2 (OTP)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const resetForm = (newMode) => {
    setMode(newMode);
    setStep(1);
    setOtp("");
    setPassword("");
    setNewPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const res = await api.post("/auth/login", { email, password });
        setToken(res.data.access_token);
        toast.success("Content de te revoir !");
        navigate("/dashboard");
      } else if (mode === "register") {
        if (step === 1) {
          await api.post("/auth/register", { email, password });
          setStep(2);
          toast.success("Code envoyé ! Vérifie ta boîte mail.");
        } else {
          await api.post("/auth/verify-otp", { email, otp });
          toast.success("Compte vérifié ! Tu peux te connecter.");
          resetForm("login");
        }
      } else if (mode === "forgot") {
        if (step === 1) {
          await api.post("/auth/forgot-password", { email });
          setStep(2);
          toast.success("Si ce compte existe, un code a été envoyé.");
        } else {
          await api.post("/auth/reset-password", {
            email,
            otp,
            new_password: newPassword,
          });
          toast.success("Mot de passe réinitialisé !");
          resetForm("login");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
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
          <div className="flex items-center gap-3 text-sm font-medium text-slate-400 bg-white/5 w-fit px-4 py-2.5 rounded-full border border-white/10 cursor-default">
            <ShieldCheck className="text-emerald-400" size={18} />
            Espace d'étude privé et sécurisé.
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm"
          >
            {/* EN-TÊTE */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                {mode === "login"
                  ? "Bienvenue"
                  : mode === "register"
                    ? step === 1
                      ? "Créer un compte"
                      : "Vérification"
                    : step === 1
                      ? "Mot de passe oublié"
                      : "Nouveau mot de passe"}
              </h2>
              <p className="text-slate-500 text-sm">
                {mode === "login" &&
                  "Connectez-vous pour retrouver vos études."}
                {mode === "register" &&
                  step === 1 &&
                  "Rejoignez-nous en quelques secondes."}
                {mode === "forgot" &&
                  step === 1 &&
                  "Entrez votre email pour recevoir un code de secours."}
                {step === 2 && `Un code a été envoyé à ${email}`}
              </p>
            </div>

            {/* FORMULAIRE */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ÉTAPE 1 : EMAIL & MOT DE PASSE */}
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
                        className="h-12 pl-11 bg-slate-50 border-slate-200 rounded-xl hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500 cursor-text transition-colors text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {mode !== "forgot" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-slate-700 font-medium"
                        >
                          Mot de passe
                        </Label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => resetForm("forgot")}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                          >
                            Oublié ?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="h-12 pl-11 bg-slate-50 border-slate-200 rounded-xl hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500 cursor-text transition-colors text-base"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ÉTAPE 2 : OTP (ET NOUVEAU MDP SI RESET) */}
              {step === 2 && (
                <div className="space-y-5 flex flex-col items-center sm:items-start py-2">
                  <div className="w-full space-y-3">
                    <Label className="text-slate-700 font-medium block text-center sm:text-left">
                      Code à 6 chiffres
                    </Label>
                    <div className="flex justify-center sm:justify-start">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="h-12 w-10 sm:w-12 border-slate-300 rounded-l-xl text-lg cursor-text"
                          />
                          <InputOTPSlot
                            index={1}
                            className="h-12 w-10 sm:w-12 border-slate-300 text-lg cursor-text"
                          />
                          <InputOTPSlot
                            index={2}
                            className="h-12 w-10 sm:w-12 border-slate-300 text-lg cursor-text"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-slate-300" />
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            className="h-12 w-10 sm:w-12 border-slate-300 text-lg cursor-text"
                          />
                          <InputOTPSlot
                            index={4}
                            className="h-12 w-10 sm:w-12 border-slate-300 text-lg cursor-text"
                          />
                          <InputOTPSlot
                            index={5}
                            className="h-12 w-10 sm:w-12 border-slate-300 rounded-r-xl text-lg cursor-text"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  {mode === "forgot" && (
                    <div className="w-full space-y-2 mt-4">
                      <Label
                        htmlFor="newPassword"
                        className="text-slate-700 font-medium"
                      >
                        Nouveau mot de passe
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                          className="h-12 pl-11 bg-slate-50 border-slate-200 rounded-xl cursor-text"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BOUTON SOUMISSION */}
              <Button
                type="submit"
                className="w-full h-12 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70 cursor-pointer active:scale-[0.98]"
                disabled={isLoading || (step === 2 && otp.length < 6)}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {mode === "login"
                  ? "Se connecter"
                  : mode === "register"
                    ? step === 1
                      ? "Créer mon compte"
                      : "Valider mon compte"
                    : step === 1
                      ? "Envoyer le code"
                      : "Réinitialiser le mot de passe"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            {/* LIENS DE NAVIGATION (FOOTER) */}
            <div className="mt-8 text-center sm:text-left text-sm text-slate-500">
              {mode === "login"
                ? "Nouveau sur BibleGraph ?"
                : "Vous avez déjà un compte ?"}
              <button
                type="button"
                className="text-blue-600 font-semibold ml-1.5 hover:text-blue-800 hover:underline transition-all outline-none cursor-pointer p-1"
                disabled={isLoading}
                onClick={() =>
                  resetForm(mode === "login" ? "register" : "login")
                }
              >
                {mode === "login" ? "Créer un compte" : "Se connecter"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
