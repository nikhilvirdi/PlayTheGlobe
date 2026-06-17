import { createSignal, onMount, type Component } from "solid-js";
import { gsap } from "gsap";
import { Howl } from "howler";
import { io } from "socket.io-client";
import type { Landmark, GameSession } from "@playtheglobe/types";

const App: Component = () => {
  // Game states
  const [score, setScore] = createSignal(0);
  const [round, setRound] = createSignal(1);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [playerCount, setPlayerCount] = createSignal(1);
  const [connectionStatus, setConnectionStatus] = createSignal("Disconnected");

  // Game UI audio setup (mock triggers)
  const clickSound = new Howl({
    src: ["data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA"], // tiny silence mock
    volume: 0.5,
  });

  const successSound = new Howl({
    src: ["data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA"],
    volume: 0.5,
  });

  // Socket connection reference
  let socket: ReturnType<typeof io> | null = null;
  let globeContainerRef!: HTMLDivElement;
  let titleRef!: HTMLHeadingElement;

  onMount(() => {
    // Animate title loading with GSAP
    gsap.fromTo(
      titleRef,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    // Initialize mock socket connection
    socket = io("http://localhost:3001", { autoConnect: false });
    
    socket.on("connect", () => {
      setConnectionStatus("Connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
    });
  });

  const startGame = () => {
    clickSound.play();
    setIsPlaying(true);
    setScore(0);
    setRound(1);

    // Dynamic UI transition using GSAP
    gsap.from(".game-interface-panel", {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.15,
      ease: "power2.out"
    });
  };

  const submitGuess = () => {
    successSound.play();
    setScore((prev) => prev + 350);

    // Animate score bounce using GSAP
    gsap.fromTo(".score-badge", 
      { scale: 1 }, 
      { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  };

  const sampleLandmark: Landmark = {
    id: "lnd_1",
    name: "Taj Mahal",
    description: "An immense mausoleum of white marble in Agra, India.",
    latitude: 27.1751,
    longitude: 78.0421,
    country: "India",
    category: "historic",
  };

  return (
    <main class="min-h-screen flex flex-col justify-between p-6 bg-slate-950 text-slate-100 relative">
      {/* Background gradients */}
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none z-0" />

      {/* Header */}
      <header class="flex justify-between items-center border-b border-slate-800 pb-4 z-10">
        <div class="flex items-center gap-3">
          <span class="text-3xl filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">🌐</span>
          <h1 ref={titleRef} class="text-2xl font-black bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
            PlayTheGlobe
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-full text-xs">
            <span class={`w-2 h-2 rounded-full ${connectionStatus() === "Connected" ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span class="text-slate-400">{connectionStatus()} ({playerCount()} online)</span>
          </div>
          {isPlaying() && (
            <div class="flex gap-3">
              <div class="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm">
                Round <span class="font-bold text-blue-400">{round()}/5</span>
              </div>
              <div class="score-badge px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm">
                Score <span class="font-bold text-emerald-400">{score()}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Board */}
      <section class="flex-1 my-6 flex justify-center items-center z-10">
        {!isPlaying() ? (
          <div class="max-w-md w-full p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-2xl flex flex-col gap-6 text-center">
            <h2 class="text-2xl font-extrabold tracking-tight">Explore the Planet</h2>
            <p class="text-slate-400 text-sm leading-relaxed">
              Analyze geographic structures, test your spatial intelligence, guess coordinates of famous world monuments on a 3D WebGL globe, and top the multiplayer leaderboard.
            </p>
            <button
              id="btn-start"
              onClick={startGame}
              class="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-bold rounded-xl shadow-lg shadow-blue-500/20 transform transition hover:-translate-y-0.5"
              type="button"
            >
              Start Playing
            </button>
          </div>
        ) : (
          <div class="w-full h-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div class="game-interface-panel md:col-span-1 p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between gap-6">
              <div class="flex flex-col gap-4">
                <span class="text-xs uppercase font-extrabold text-blue-400 tracking-wider">Active Location</span>
                <h3 class="text-xl font-bold text-slate-100">{sampleLandmark.name}</h3>
                <p class="text-slate-400 text-sm leading-relaxed">{sampleLandmark.description}</p>
                <div class="px-3 py-2 bg-slate-950/50 rounded-lg border border-slate-800 text-xs text-slate-500 font-mono">
                  Category: {sampleLandmark.category} | Region: {sampleLandmark.country}
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <button
                  id="btn-guess"
                  onClick={submitGuess}
                  class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-lg transition"
                  type="button"
                >
                  Lock Guess
                </button>
                <button
                  id="btn-next"
                  onClick={() => setRound((prev) => Math.min(prev + 1, 5))}
                  class="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition"
                  type="button"
                >
                  Skip Round
                </button>
              </div>
            </div>

            {/* Globe Viewport */}
            <div class="game-interface-panel md:col-span-2 relative min-h-[400px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
              <div ref={globeContainerRef} class="absolute inset-0 z-0" />
              <div class="text-center z-10 flex flex-col items-center gap-2 pointer-events-none">
                <span class="text-4xl filter drop-shadow-lg animate-pulse">🌍</span>
                <p class="text-slate-400 text-sm font-semibold">WebGL 3D Globe viewport container</p>
                <span class="text-xs text-slate-600 font-mono">Three.js + globe.gl will mount here</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer class="text-center text-xs text-slate-600 border-t border-slate-900 pt-4 z-10">
        <p>&copy; {new Date().getFullYear()} PlayTheGlobe. Managed with Turborepo & Biome.</p>
      </footer>
    </main>
  );
};

export default App;
