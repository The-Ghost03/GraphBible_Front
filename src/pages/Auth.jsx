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
// 🚀 IMPORT DE FRAMER MOTION
import { motion } from "framer-motion";
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
  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'forgot'
  const [step, setStep] = useState(1); // 1: Formulaire, 2: OTP
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
        const userRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
        });

        toast.success("Content de te revoir !");

        // Aiguillage : Admin ou Utilisateur normal ?
        if (userRes.data.role === "superadmin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
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
      // ON INTERCEPTE L'ERREUR 403 POUR BASCULER SUR L'ÉCRAN OTP
      if (mode === "login" && err.response?.status === 403) {
        toast.success("Un nouveau code a été envoyé à ton adresse e-mail !");
        setMode("register");
        setStep(2);
      } else {
        toast.error(err.response?.data?.detail || "Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 VARIANTES D'ANIMATION POUR LE TEXTE (Staggered Children)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Délai entre chaque enfant
        delayChildren: 0.3, // Délai avant le début de l'animation
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden relative">
      {/* 🚀 CÔTÉ GAUCHE : Animé et Immersif (Mise à jour avec Framer Motion) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center p-12 lg:p-24 text-white">
        {/* BLOBS ANIMÉS (Mouvement flottant lent + pulse) */}
        <motion.div
          animate={{
            x: [-10, 10, -10],
            y: [-5, 5, -5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"
        />

        <motion.div
          animate={{
            x: [10, -10, 10],
            y: [5, -5, 5],
            scale: [1.05, 1, 1.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1, // Léger décalage pour ne pas être synchro avec le premier
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"
        />

        {/* CONTENU TEXTUEL ANIMÉ EN CASCADE */}
        <motion.div
          className="relative z-10 max-w-lg"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-extrabold tracking-tight mb-6 flex items-center gap-3"
          >
            BibleGraph <span className="text-blue-500">🌿</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-300 mb-10 leading-relaxed font-light"
          >
            Pénétrez la profondeur de la Parole. Visualisez, connectez et
            comprenez l'Écriture comme jamais auparavant.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 text-sm font-medium text-slate-400 bg-white/5 w-fit px-4 py-2.5 rounded-full border border-white/10 cursor-default"
          >
            <ShieldCheck className="text-emerald-400" size={18} />
            Espace d'étude privé et sécurisé.
          </motion.div>
        </motion.div>
      </div>

      {/* CÔTÉ DROIT : Formulaire (Inchangé) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div
          key={`${mode}-${step}`}
          className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {mode === "login"
                ? "Connectez-vous"
                : mode === "register"
                  ? step === 1
                    ? "Créer mon compte d'étude"
                    : "Vérification"
                  : step === 1
                    ? "Mot de passe oublié"
                    : "Réinitialiser"}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === "login" &&
                "Vos cartographies bibliques vous attendent."}
              {mode === "register" &&
                step === 1 &&
                "Rejoignez la communauté de recherche biblique."}
              {mode === "forgot" &&
                step === 1 &&
                "Entrez votre email pour recevoir un code de secours."}
              {step === 2 && `Un code a été envoyé à ${email}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
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
                    : "Réinitialiser"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 text-center sm:text-left text-sm text-slate-500">
            {mode === "login"
              ? "Nouveau sur BibleGraph ?"
              : "Vous avez déjà un compte ?"}
            <button
              type="button"
              className="text-blue-600 font-semibold ml-1.5 hover:text-blue-800 hover:underline transition-all outline-none cursor-pointer p-1"
              disabled={isLoading}
              onClick={() => resetForm(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Créer un compte" : "Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
