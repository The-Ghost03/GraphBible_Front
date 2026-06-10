import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, Lock, Loader2, ArrowRight, KeyRound,
  Eye, EyeOff, GitBranch, Check, ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/store";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import {
  InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator,
} from "@/components/ui/input-otp";

// Variants statiques (pas de fonctions dynamiques)
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const fadeUp1 = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.1 } } };
const fadeUp2 = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.2 } } };
const fadeUp3 = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.3 } } };
const formFade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } };

const FEATURES = [
  "Cartes mentales bibliques interactives",
  "Bible complète — 66 livres, 1 189 chapitres",
  "Sauvegarde automatique en temps réel",
  "Export PDF & PNG en un clic",
];

export default function Auth() {
  const [mode, setMode]           = useState("login"); // login | register | forgot
  const [step, setStep]           = useState(1);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [newPwd, setNewPwd]       = useState("");
  const [otp, setOtp]             = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd]     = useState(false);

  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const resetForm = (nextMode) => {
    setMode(nextMode); setStep(1);
    setOtp(""); setPassword(""); setNewPwd(""); setShowPwd(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "login") {
        const res     = await api.post("/auth/login", { email, password });
        setToken(res.data.access_token);
        const userRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
        });
        toast.success("Content de te revoir !");
        navigate(userRes.data.role === "superadmin" ? "/admin" : "/dashboard");
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
      } else {
        if (step === 1) {
          await api.post("/auth/forgot-password", { email });
          setStep(2);
          toast.success("Si ce compte existe, un code a été envoyé.");
        } else {
          await api.post("/auth/reset-password", { email, otp, new_password: newPwd });
          toast.success("Mot de passe réinitialisé !");
          resetForm("login");
        }
      }
    } catch (err) {
      if (mode === "login" && err.response?.status === 403) {
        toast.success("Un nouveau code a été envoyé à ton adresse e-mail !");
        setMode("register"); setStep(2);
      } else {
        toast.error(err.response?.data?.detail || "Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Textes dynamiques
  const title = mode === "login" ? "Bon retour !"
    : mode === "register" ? (step === 1 ? "Créer un compte" : "Vérification e-mail")
    : (step === 1 ? "Mot de passe oublié" : "Réinitialisation");

  const subtitle = mode === "login" ? "Vos études vous attendent."
    : mode === "register" ? (step === 1 ? "Rejoignez la communauté d'étude biblique." : `Code envoyé à ${email}`)
    : (step === 1 ? "Entrez votre e-mail pour recevoir un code." : `Code envoyé à ${email}`);

  const btnLabel = mode === "login" ? "Se connecter"
    : mode === "register" ? (step === 1 ? "Créer mon compte" : "Valider mon compte")
    : (step === 1 ? "Envoyer le code" : "Réinitialiser le mot de passe");

  return (
    <div className="min-h-screen flex font-sans">

      {/* ── PANNEAU GAUCHE ── */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-2/5 flex-col justify-between p-12 xl:p-16 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#0f2744 55%,#0f172a 100%)" }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.8) 1px,transparent 0)", backgroundSize: "28px 28px" }} />
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 font-bold text-lg">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <GitBranch className="w-5 h-5" />
          </div>
          BibleGraph
        </div>

        {/* Contenu central */}
        <div className="relative z-10 max-w-xs">
          <motion.h2 variants={fadeUp} initial="hidden" animate="show"
            className="text-4xl font-extrabold leading-snug mb-4">
            Explorez la Bible<br />
            <span className="text-blue-400">avec une vision claire.</span>
          </motion.h2>
          <motion.p variants={fadeUp1} initial="hidden" animate="show"
            className="text-slate-300 text-sm leading-relaxed mb-8">
            Créez des cartes mentales, reliez vos passages et exportez vos études — tout dans un seul espace de travail visuel.
          </motion.p>
          <motion.ul variants={fadeUp2} initial="hidden" animate="show" className="space-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-blue-400" />
                </span>
                {f}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Footer */}
        <motion.p variants={fadeUp3} initial="hidden" animate="show"
          className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} BibleGraph — Accès 100 % gratuit
        </motion.p>
      </div>

      {/* ── PANNEAU DROIT (formulaire) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <a href="/" className="lg:hidden flex items-center gap-2 text-blue-700 font-bold text-lg mb-8">
            <GitBranch className="w-5 h-5" />
            BibleGraph
          </a>

          {/* Header animé */}
          <motion.div key={`hdr-${mode}-${step}`} variants={formFade} initial="hidden" animate="show" className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
            <p className="text-slate-500 text-sm">{subtitle}</p>
          </motion.div>

          {/* Formulaire */}
          <motion.form key={`frm-${mode}-${step}`} variants={formFade} initial="hidden" animate="show"
            onSubmit={handleSubmit} className="space-y-4">

            {/* ── Étape 1 ── */}
            {step === 1 && (
              <>
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Adresse e-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input id="email" type="email" placeholder="nom@exemple.com"
                      className="h-11 pl-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading} required />
                  </div>
                </div>

                {/* Mot de passe */}
                {mode !== "forgot" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de passe</Label>
                      {mode === "login" && (
                        <button type="button" onClick={() => resetForm("forgot")}
                          className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium">
                          Oublié ?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••"
                        className="h-11 pl-9 pr-10 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading} required />
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}>
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Étape 2 (OTP) ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Code à 6 chiffres</Label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-11 w-11 border-slate-200 rounded-l-lg text-base" />
                      <InputOTPSlot index={1} className="h-11 w-11 border-slate-200 text-base" />
                      <InputOTPSlot index={2} className="h-11 w-11 border-slate-200 text-base" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="h-11 w-11 border-slate-200 text-base" />
                      <InputOTPSlot index={4} className="h-11 w-11 border-slate-200 text-base" />
                      <InputOTPSlot index={5} className="h-11 w-11 border-slate-200 rounded-r-lg text-base" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {mode === "forgot" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="newPwd" className="text-sm font-medium text-slate-700">Nouveau mot de passe</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input id="newPwd" type={showPwd ? "text" : "password"} placeholder="••••••••"
                        className="h-11 pl-9 pr-10 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
                        value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                        disabled={isLoading} required />
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}>
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bouton submit */}
            <Button type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98] disabled:opacity-60"
              disabled={isLoading || (step === 2 && otp.length < 6)}>
              {isLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <>{btnLabel}<ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </motion.form>

          {/* Liens secondaires */}
          <div className="mt-6 space-y-3">
            {step === 1 && mode !== "forgot" && (
              <p className="text-sm text-slate-500 text-center sm:text-left">
                {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}
                <button type="button"
                  className="ml-1.5 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                  disabled={isLoading}
                  onClick={() => resetForm(mode === "login" ? "register" : "login")}>
                  {mode === "login" ? "S'inscrire gratuitement" : "Se connecter"}
                </button>
              </p>
            )}

            {(step === 2 || mode === "forgot") && (
              <button type="button" onClick={() => resetForm("login")}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                <ChevronLeft className="h-4 w-4" />
                Retour à la connexion
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
