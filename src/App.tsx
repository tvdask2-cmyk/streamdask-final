import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const locales = ["FR", "EN", "ES", "DE", "IT", "AR"] as const;
const pages = ["Home", "Live", "Replay", "Studio", "Profil", "Admin"] as const;

const labels = {
  FR: {
    appTitle: "StreamDask Mix Live",
    appSubtitle: "Plateforme live audio/video pour createurs",
    launch: "Lancer le direct",
    connectObs: "Connecter OBS",
    audienceNow: "Audience en direct",
    streamHealth: "Sante du flux",
  },
  EN: {
    appTitle: "StreamDask Mix Live",
    appSubtitle: "Audio/video live platform for creators",
    launch: "Go live",
    connectObs: "Connect OBS",
    audienceNow: "Live audience",
    streamHealth: "Stream health",
  },
  ES: {
    appTitle: "StreamDask Mix Live",
    appSubtitle: "Plataforma en vivo para creadores",
    launch: "Iniciar directo",
    connectObs: "Conectar OBS",
    audienceNow: "Audiencia en vivo",
    streamHealth: "Salud del stream",
  },
  DE: {
    appTitle: "StreamDask Mix Live",
    appSubtitle: "Live-Audio/Video Plattform fur Creator",
    launch: "Live starten",
    connectObs: "OBS verbinden",
    audienceNow: "Live Publikum",
    streamHealth: "Stream Zustand",
  },
  IT: {
    appTitle: "StreamDask Mix Live",
    appSubtitle: "Piattaforma live audio/video per creator",
    launch: "Avvia live",
    connectObs: "Connetti OBS",
    audienceNow: "Pubblico live",
    streamHealth: "Stato stream",
  },
  AR: {
    appTitle: "StreamDask Mix Live",
    appSubtitle: "Live audio/video platform",
    launch: "Start Live",
    connectObs: "Connect OBS",
    audienceNow: "Live Audience",
    streamHealth: "Stream Health",
  },
} as const;

type Locale = (typeof locales)[number];
type Page = (typeof pages)[number];

const mixerImage =
  "https://www.pioneerdj.com/-/media/pioneerdj/images/products/mixer/djm-s11/djm-s11-main.jpg";

export function App() {
  const [locale, setLocale] = useState<Locale>("FR");
  const [page, setPage] = useState<Page>("Home");
  const [obsConnected, setObsConnected] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isTauriRuntime = typeof window !== "undefined" && "__TAURI_INTERNALS__" in (window as unknown as Record<string, unknown>);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const content = labels[locale];

  const body = useMemo(() => {
    if (page === "Home") {
      return (
        <div className="space-y-8">
          <section>
            <p className="text-sm uppercase tracking-[0.18em] text-violet-300">Workspace</p>
            <h1 className="mt-3 text-4xl font-semibold">{content.appTitle}</h1>
            <p className="mt-3 max-w-2xl text-zinc-300">{content.appSubtitle}</p>
          </section>
          <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-semibold">Onboarding createur</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                {[
                  "Choix langue + theme",
                  "Configuration chaine et profil",
                  "Connexion OBS ou camera native",
                  "Preview audio/video",
                  "Go live + replay auto",
                ].map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-violet-300" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-semibold">KPI live</h2>
              <div className="mt-4 space-y-4 text-sm text-zinc-300">
                <div>
                  <p>{content.audienceNow}</p>
                  <p className="text-2xl font-semibold text-zinc-100">2,184</p>
                </div>
                <div>
                  <p>{content.streamHealth}</p>
                  <p className="text-emerald-400">Stable - 1080p / 4.8 Mbps</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (page === "Live") {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLive((current) => !current)}
              className="rounded-full bg-violet-300 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-violet-200"
            >
              {isLive ? "Arreter" : content.launch}
            </button>
            <button
              onClick={() => setObsConnected((current) => !current)}
              className="rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white"
            >
              {content.connectObs}
            </button>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isLive ? "bg-red-400/20 text-red-300" : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {isLive ? "LIVE" : "OFFLINE"}
            </motion.span>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
              <img src={mixerImage} alt="Table de mixage Pioneer DJM-S11" className="h-80 w-full object-cover" />
              <div className="p-5 text-sm text-zinc-300">
                Source principale remplacee par une table de mixage Pioneer S11 pour le setup DJ live.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-semibold">Chat live</h2>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <p>@vibeclub: Le mix est propre.</p>
                <p>@studiobeat: Basse nette sur la scene B.</p>
                <p>@mina: Replay favori active.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (page === "Replay") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">Bibliotheque replay</h1>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {[
              "Warm-up set - 58 min - Premium",
              "Sunset session - 1h23 - Public",
              "After movie event label - 42 min - Public",
            ].map((item) => (
              <p key={item} className="py-4 text-zinc-300">
                {item}
              </p>
            ))}
          </div>
        </div>
      );
    }

    if (page === "Studio") {
      return (
        <div className="space-y-8">
          <h1 className="text-3xl font-semibold">Studio de creation</h1>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-semibold">Scenes OBS</h2>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                {[
                  "Scene Intro",
                  "Scene Pioneer S11 Main",
                  "Scene Chat Overlay",
                  "Scene Outro",
                ].map((scene) => (
                  <button
                    key={scene}
                    className="w-full rounded-lg border border-white/10 px-3 py-2 text-left transition hover:border-violet-300"
                  >
                    {scene}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-semibold">Etat connexion</h2>
              <p className="mt-4 text-sm text-zinc-300">
                OBS websocket: <span className={obsConnected ? "text-emerald-400" : "text-red-300"}>{obsConnected ? "Connecte" : "Deconnecte"}</span>
              </p>
              <p className="mt-2 text-sm text-zinc-300">Latency moyenne: 1.8 sec</p>
              <p className="mt-2 text-sm text-zinc-300">ABR profils: 1080p / 720p / 480p</p>
            </div>
          </div>
        </div>
      );
    }

    if (page === "Profil") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">Profil createur</h1>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 text-sm text-zinc-300">
            <p>Nom de chaine: StreamDask Studio</p>
            <p className="mt-2">Plan: Premium Pro</p>
            <p className="mt-2">Langue preferee: {locale}</p>
            <p className="mt-2">Monetisation active: oui</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Panneau administration</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <h2 className="text-lg font-semibold">Moderation live</h2>
            <p className="mt-3 text-sm text-zinc-300">8 signalements en attente, 2 bans temporaires actifs.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            <h2 className="text-lg font-semibold">Audit</h2>
            <p className="mt-3 text-sm text-zinc-300">Toutes les actions critiques sont journalisees et exportables.</p>
          </div>
        </div>
      </div>
    );
  }, [content, isLive, locale, obsConnected, page]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3">
          <div>
            <p className="text-xl font-semibold">StreamDask Mix Live</p>
            <p className="text-sm text-zinc-400">Creator control center</p>
          </div>
          <div className="flex items-center gap-3">
            {installPrompt && !isTauriRuntime ? (
              <button
                onClick={handleInstall}
                className="rounded-full bg-violet-300 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-violet-200"
              >
                Installer l'application
              </button>
            ) : null}
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950 p-1">
              {locales.map((item) => (
                <button
                  key={item}
                  onClick={() => setLocale(item)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    locale === item ? "bg-violet-300 text-zinc-950" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3">
            <nav className="space-y-1">
              {pages.map((item) => (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    page === item ? "bg-violet-300/20 text-violet-200" : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          <main className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                {body}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
