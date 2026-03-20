import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../features/auth/store";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // Connexion
        const res = await api.post("/auth/login", { email, password });
        setToken(res.data.access_token);
        navigate("/dashboard"); // On redirige vers le tableau de bord
      } else {
        // Inscription
        if (step === 1) {
          await api.post("/auth/register", { email, password });
          setStep(2); // On passe à l'étape OTP
        } else {
          await api.post("/auth/verify-otp", { email, otp });
          alert("Compte vérifié ! Tu peux maintenant te connecter.");
          setIsLogin(true);
          setStep(1);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          BibleGraph 🌿
        </h1>
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isLogin
            ? "Connexion"
            : step === 1
              ? "Inscription"
              : "Vérification OTP"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step === 2}
            required
          />
          {step === 1 && (
            <input
              type="password"
              placeholder="Mot de passe"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          {step === 2 && !isLogin && (
            <input
              type="text"
              placeholder="Code OTP à 6 chiffres"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
          >
            {isLogin
              ? "Se connecter"
              : step === 1
                ? "S'inscrire"
                : "Vérifier le code"}
          </button>
        </form>

        {step === 1 && (
          <p className="text-sm text-center mt-4 text-slate-500">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button
              className="text-blue-600 font-bold ml-1 hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
