import { type Component, Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import StreakFlame from "../UI/StreakFlame.js";

const Navbar: Component = () => {
  // Simple reactive user state (mocked or loaded from localStorage)
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [username, setUsername] = createSignal("explorer");
  const [streak, setStreak] = createSignal(12);

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav 
      class="flex justify-between items-center px-4 w-full"
      style={{
        background: "var(--color-dark)",
        "border-bottom": "3px solid var(--color-primary)",
        height: "64px",
        "box-sizing": "border-box",
        "position": "relative",
        "z-index": "100"
      }}
    >
      {/* Left: Logo */}
      {/* TODO replace text logo with /public/logo.png once exported from Canva (Kitsch Display font), target size 40x40px display */}
      <A 
        href="/" 
        class="text-primary"
        style={{
          "font-size": "12px",
          "font-weight": "black",
          "text-decoration": "none",
          "letter-spacing": "-1px"
        }}
      >
        PlayTheGlobe
      </A>

      {/* Center: Nav Links */}
      <div 
        class="flex gap-2"
        style={{
          "font-size": "8px"
        }}
      >
        <A href="/play" class="text-white hover:text-primary px-2 py-1" style={{ "text-decoration": "none" }}>Play</A>
        <A href="/leaderboard" class="text-white hover:text-primary px-2 py-1" style={{ "text-decoration": "none" }}>Leaderboard</A>
        <A href="/collection" class="text-white hover:text-primary px-2 py-1" style={{ "text-decoration": "none" }}>Collection</A>
      </div>

      {/* Right: Auth Profile Info */}
      <div 
        class="flex items-center gap-3"
        style={{
          "font-size": "8px"
        }}
      >
        <Show 
          when={isLoggedIn()} 
          fallback={
            <div class="flex gap-2">
              <A href="/login" class="text-primary" style={{ "text-decoration": "none" }}>[Login]</A>
              <A href="/register" class="text-accent-blue" style={{ "text-decoration": "none" }}>[Register]</A>
            </div>
          }
        >
          <div class="flex items-center gap-2">
            <span class="text-white">{username()}</span>
            <StreakFlame streak={streak()} />
            <button 
              onClick={logout} 
              class="text-secondary cursor-pointer"
              style={{
                background: "none",
                border: "none",
                font: "inherit",
                padding: "0"
              }}
              type="button"
            >
              [Logout]
            </button>
          </div>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
