import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, GitBranch, FileText, Download,
  Cloud, Smartphone, ArrowRight, Check, Network, Sparkles,
} from "lucide-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const FEATURES = [
  { icon: Network, title: "Cartes mentales bibliques", desc: "Visualisez les liens entre les passages, les thèmes et les personnages sur un canvas interactif.", color: "bg-blue-50 text-blue-600" },
  { icon: BookOpen, title: "Bible complète intégrée", desc: "Accédez aux 66 livres et 1 189 chapitres directement dans l'éditeur. Sélectionnez un passage en 3 clics.", color: "bg-indigo-50 text-indigo-600" },
  { icon: FileText, title: "Fiches d'étude riches", desc: "Rédigez vos notes avec un éditeur complet (titres, listes, citations) attaché à chaque étude.", color: "bg-violet-50 text-violet-600" },
  { icon: Download, title: "Export PDF & PNG", desc: "Exportez votre carte ou votre fiche d'étude en un clic pour l'imprimer ou la partager.", color: "bg-amber-50 text-amber-600" },
  { icon: Cloud, title: "Sauvegarde automatique", desc: "Chaque modification est sauvegardée en temps réel. Retrouvez vos études sur tous vos appareils.", color: "bg-green-50 text-green-600" },
  { icon: Smartphone, title: "Mobile & Desktop", desc: "Interface adaptée à tous les écrans. Installez l'application directement sur votre téléphone.", color: "bg-pink-50 text-pink-600" },
];

const STEPS = [
  { n: "1", title: "Choisissez vos passages", desc: "Sélectionnez le livre, le chapitre et la plage de versets. Le texte s'ajoute instantanément à votre espace." },
  { n: "2", title: "Connectez les idées", desc: "Reliez les passages entre eux avec des flèches annotées. Ajoutez des notes colorées pour vos réflexions." },
  { n: "3", title: "Exportez et partagez", desc: "Téléchargez votre carte en PNG, votre fiche d'étude en PDF, et gardez une trace structurée de votre travail." },
];

const STATS = [
  { value: "66", label: "Livres de la Bible" },
  { value: "1 189", label: "Chapitres disponibles" },
  { value: "31 000+", label: "Versets accessibles" },
  { value: "100%", label: "Gratuit à l'inscription" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased overflow-x-hidden">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-lg text-blue-700 select-none">
            <GitBranch className="w-5 h-5" />
            BibleGraph
          </a>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/auth")} className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 transition-colors">
              Connexion
            </button>
            <button onClick={() => navigate("/auth")} className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
              S'inscrire gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
          <motion.div variants={FADE_UP} initial="hidden" animate="show" className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Accès 100% gratuit · Aucune carte bancaire requise
          </motion.div>
          <motion.h1 variants={FADE_UP} initial="hidden" animate="show" custom={1} className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Étudiez la Bible.<br />
            <span className="text-blue-400">Visualisez les connexions.</span>
          </motion.h1>
          <motion.p variants={FADE_UP} initial="hidden" animate="show" custom={2} className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Créez des cartes mentales interactives à partir de vos passages bibliques, reliez vos idées et exportez vos études en PDF. Tout dans un seul espace de travail.
          </motion.p>
          <motion.div variants={FADE_UP} initial="hidden" animate="show" custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate("/auth")} className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/40 text-base">
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#comment-ca-marche" className="text-slate-300 hover:text-white font-medium px-5 py-3 rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-base">
              Voir comment ça marche
            </a>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-blue-400">{s.value}</p>
              <p className="text-slate-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Un outil pensé pour les pasteurs, enseignants, étudiants et tous ceux qui veulent aller plus loin dans leur étude biblique.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5} className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all bg-white">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="comment-ca-marche" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Prêt en 3 étapes</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Pas de courbe d'apprentissage. Ouvrez l'app et commencez à étudier.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5} className="relative text-center">
                {i < STEPS.length - 1 && <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-slate-200" />}
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-5 shadow-md shadow-blue-200">{s.n}</div>
                <h3 className="font-semibold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Pourquoi choisir BibleGraph ?</h2>
              <ul className="space-y-4">
                {[
                  "Aucune installation — fonctionne dans votre navigateur",
                  "Bible en français intégrée (66 livres, 1 189 chapitres)",
                  "Vos données sauvegardées en temps réel",
                  "Export PDF de vos cartes et fiches d'étude",
                  "Interface adaptée aux mobiles",
                  "Compte créé en moins de 2 minutes",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center shadow-xl shadow-blue-200">
              <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-2xl font-bold mb-2">Conçu pour la profondeur</p>
              <p className="text-blue-100 text-sm leading-relaxed">BibleGraph ne remplace pas votre Bible — il vous aide à voir des connexions que vous n'auriez jamais remarquées avec une prise de notes linéaire.</p>
              <div className="mt-6 pt-6 border-t border-blue-500/40 grid grid-cols-2 gap-4 text-center">
                <div><p className="text-2xl font-extrabold">2s</p><p className="text-blue-200 text-xs">Auto-sauvegarde</p></div>
                <div><p className="text-2xl font-extrabold">∞</p><p className="text-blue-200 text-xs">Études illimitées</p></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Prêt à approfondir votre étude ?</h2>
            <p className="text-slate-300 text-lg mb-8">Rejoignez BibleGraph gratuitement. Aucune carte bancaire requise.</p>
            <button onClick={() => navigate("/auth")} className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 text-base">
              Créer mon espace gratuitement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 text-sm py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-semibold">
            <GitBranch className="w-4 h-4" />
            BibleGraph
          </div>
          <p>© {new Date().getFullYear()} BibleGraph — Tous droits réservés</p>
          <a href="mailto:biblegraph@softskills.ci" className="hover:text-slate-300 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
