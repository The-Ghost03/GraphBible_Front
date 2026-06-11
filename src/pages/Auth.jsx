import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// ── Schémas Zod ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().min(1, "Requis").email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
const registerSchema = z.object({
  email:    z.string().min(1, "Requis").email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
});
const forgotSchema = z.object({
  email: z.string().min(1, "Requis").email("Email invalide"),
});
const resetSchema = z.object({
  newPwd: z.string().min(8, "Minimum 8 caractères"),
});

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const fadeUp1 = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.1 } } };
const fadeUp2 = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.2 } } };
const fadeUp3 = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.3 } } };
const formFade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } };

const FEATURES = [
  "Cartes mentales bibliques interactives",
  "Bible complète — 66 livres, 1 189 chapitres",
  "Sauvegarde automatique en temps réel",
  "Export PDF & PNG en un clic",
];

// ── Composant erreur ──────────────────────────────────────────────────────────
function FieldError({ error }) {
  if (!error) return null;
  return <p className="text-xs text-red-500 mt-1">{error.message}</p>;
}

// ── Formulaire Login ──────────────────────────────────────────────────────────
function LoginForm({ onSubmit, isLoading, onForgot, onRegister }) {
  const [showPwd, setShowPwd] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Adresse e-mail</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input id="email" type="email" placeholder="nom@exemple.com"
            className="h-11 pl-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
            {...register("email")} disabled={isLoading} />
        </div>
        <FieldError error={errors.email} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de passe</Label>
          <button type="button" onClick={onForgot} className="text-xs text-blue-600 hover:underline font-medium">Oublié ?</button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••"
            className="h-11 pl-9 pr-10 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
            {...register("password")} disabled={isLoading} />
          <button type="button" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError error={errors.password} />
      </div>
      <Button type="submit" disabled={isLoading}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98]">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Se connecter<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
      <p className="text-sm text-slate-500 text-center">
        Pas encore de compte ?{" "}
        <button type="button" onClick={onRegister} className="text-blue-600 font-semibold hover:underline">S'inscrire gratuitement</button>
      </p>
    </form>
  );
}

// ── Formulaire Register step 1 ────────────────────────────────────────────────
function RegisterForm({ onSubmit, isLoading, onLogin }) {
  const [showPwd, setShowPwd] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="reg-email" className="text-sm font-medium text-slate-700">Adresse e-mail</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input id="reg-email" type="email" placeholder="nom@exemple.com"
            className="h-11 pl-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
            {...register("email")} disabled={isLoading} />
        </div>
        <FieldError error={errors.email} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reg-password" className="text-sm font-medium text-slate-700">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input id="reg-password" type={showPwd ? "text" : "password"} placeholder="Minimum 8 caractères"
            className="h-11 pl-9 pr-10 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
            {...register("password")} disabled={isLoading} />
          <button type="button" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError error={errors.password} />
      </div>
      <Button type="submit" disabled={isLoading}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98]">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Créer mon compte<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
      <p className="text-sm text-slate-500 text-center">
        Déjà inscrit ?{" "}
        <button type="button" onClick={onLogin} className="text-blue-600 font-semibold hover:underline">Se connecter</button>
      </p>
    </form>
  );
}

// ── Formulaire Forgot step 1 ──────────────────────────────────────────────────
function ForgotForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="forgot-email" className="text-sm font-medium text-slate-700">Adresse e-mail</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input id="forgot-email" type="email" placeholder="nom@exemple.com"
            className="h-11 pl-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
            {...register("email")} disabled={isLoading} />
        </div>
        <FieldError error={errors.email} />
      </div>
      <Button type="submit" disabled={isLoading}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98]">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Envoyer le code<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
    </form>
  );
}

// ── Formulaire Reset password (step 2 forgot) ─────────────────────────────────
function ResetForm({ onSubmit, isLoading, email }) {
  const [showPwd, setShowPwd] = useState(false);
  const [otp, setOtp] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
  });
  const onFormSubmit = (data) => {
    if (otp.length < 6) { toast.error("Entrez le code à 6 chiffres."); return; }
    onSubmit({ otp, newPwd: data.newPwd });
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs text-slate-500">Code envoyé à <strong>{email}</strong></p>
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
      <div className="space-y-1.5">
        <Label htmlFor="new-pwd" className="text-sm font-medium text-slate-700">Nouveau mot de passe</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input id="new-pwd" type={showPwd ? "text" : "password"} placeholder="Minimum 8 caractères"
            className="h-11 pl-9 pr-10 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-blue-500"
            {...register("newPwd")} disabled={isLoading} />
          <button type="button" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError error={errors.newPwd} />
      </div>
      <Button type="submit" disabled={isLoading || otp.length < 6}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98]">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Réinitialiser<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
    </form>
  );
}

// ── Étape OTP register ─────────────────────────────────────────────────────────
function OTPVerifyForm({ onSubmit, isLoading, email }) {
  const [otp, setOtp] = useState("");
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">Code envoyé à <strong>{email}</strong></p>
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
      <Button onClick={() => onSubmit(otp)} disabled={isLoading || otp.length < 6}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98]">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Valider mon compte<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
    </div>
  );
}

// ── Page Auth principale ───────────────────────────────────────────────────────
export default function Auth() {
  const [mode, setMode]           = useState("login");
  const [step, setStep]           = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef                  = useRef("");

  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const resetToLogin = () => { setMode("login"); setStep(1); };

  const wrap = (fn) => async (...args) => {
    setIsLoading(true);
    try { await fn(...args); }
    finally { setIsLoading(false); }
  };

  const handleLogin = wrap(async ({ email, password }) => {
    const res     = await api.post("/auth/login", { email, password });
    setToken(res.data.access_token);
    const userRes = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${res.data.access_token}` },
    });
    toast.success("Content de te revoir !");
    navigate(userRes.data.role === "superadmin" ? "/admin" : "/dashboard");
  });

  const handleRegister = wrap(async ({ email, password }) => {
    emailRef.current = email;
    await api.post("/auth/register", { email, password });
    setStep(2);
    toast.success("Code envoyé ! Vérifie ta boîte mail.");
  });

  const handleOTPVerify = wrap(async (otp) => {
    await api.post("/auth/verify-otp", { email: emailRef.current, otp });
    toast.success("Compte vérifié ! Tu peux te connecter.");
    resetToLogin();
  });

  const handleForgot = wrap(async ({ email }) => {
    emailRef.current = email;
    await api.post("/auth/forgot-password", { email });
    setStep(2);
    toast.success("Si ce compte existe, un code a été envoyé.");
  });

  const handleReset = wrap(async ({ otp, newPwd }) => {
    await api.post("/auth/reset-password", {
      email: emailRef.current, otp, new_password: newPwd,
    });
    toast.success("Mot de passe réinitialisé !");
    resetToLogin();
  });

  // Gestion des erreurs globales API
  const safeWrap = (fn) => async (...args) => {
    try { await fn(...args); }
    catch (err) {
      if (mode === "login" && err.response?.status === 403) {
        toast.success("Un code a été envoyé à ton adresse e-mail !");
        setMode("register"); setStep(2);
      } else {
        toast.error(err.response?.data?.detail || "Une erreur est survenue.");
      }
    }
  };

  const titles = {
    login:         { main: "Bon retour !",           sub: "Vos études vous attendent." },
    register_1:    { main: "Créer un compte",        sub: "Rejoignez la communauté d'étude biblique." },
    register_2:    { main: "Vérification e-mail",    sub: "Entrez le code reçu par e-mail." },
    forgot_1:      { main: "Mot de passe oublié",    sub: "Entrez votre e-mail pour recevoir un code." },
    forgot_2:      { main: "Réinitialisation",       sub: "Entrez votre code et choisissez un nouveau mot de passe." },
  };
  const key = mode === "login" ? "login" : `${mode}_${step}`;
  const { main, sub } = titles[key] || titles.login;

  const isOTPStep = step === 2;

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── PANNEAU GAUCHE ──────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-2/5 flex-col justify-between p-12 xl:p-16 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#0f2744 55%,#0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.8) 1px,transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)" }} />

        <div className="relative z-10 flex items-center gap-2.5 font-bold text-lg">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <GitBranch className="w-5 h-5" />
          </div>
          BibleGraph
        </div>

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

        <motion.p variants={fadeUp3} initial="hidden" animate="show"
          className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} BibleGraph — Accès 100 % gratuit
        </motion.p>
      </div>

      {/* ── PANNEAU DROIT ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
        <div className="w-full max-w-sm">
          <a href="/" className="lg:hidden flex items-center gap-2 text-blue-700 font-bold text-lg mb-8">
            <GitBranch className="w-5 h-5" /> BibleGraph
          </a>

          <motion.div key={key} variants={formFade} initial="hidden" animate="show" className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{main}</h1>
            <p className="text-slate-500 text-sm">{sub}</p>
          </motion.div>

          <motion.div key={`form-${key}`} variants={formFade} initial="hidden" animate="show">
            {mode === "login" && (
              <LoginForm
                onSubmit={safeWrap(handleLogin)}
                isLoading={isLoading}
                onForgot={() => { setMode("forgot"); setStep(1); }}
                onRegister={() => { setMode("register"); setStep(1); }}
              />
            )}
            {mode === "register" && step === 1 && (
              <RegisterForm
                key="register"
                onSubmit={safeWrap(handleRegister)}
                isLoading={isLoading}
                onLogin={() => { setMode("login"); setStep(1); }}
              />
            )}
            {mode === "register" && step === 2 && (
              <OTPVerifyForm
                onSubmit={safeWrap(handleOTPVerify)}
                isLoading={isLoading}
                email={emailRef.current}
              />
            )}
            {mode === "forgot" && step === 1 && (
              <ForgotForm
                key="forgot"
                onSubmit={safeWrap(handleForgot)}
                isLoading={isLoading}
              />
            )}
            {mode === "forgot" && step === 2 && (
              <ResetForm
                onSubmit={safeWrap(handleReset)}
                isLoading={isLoading}
                email={emailRef.current}
              />
            )}
          </motion.div>

          {isOTPStep && (
            <button type="button" onClick={resetToLogin}
              className="mt-5 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              <ChevronLeft className="h-4 w-4" /> Retour à la connexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
