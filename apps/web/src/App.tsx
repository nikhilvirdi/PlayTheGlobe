import type { Component } from "solid-js";
import { Router, Route } from "@solidjs/router";
import PageWrapper from "./components/Layout/PageWrapper.js";
import PixelPanel from "./components/UI/PixelPanel.js";
import PixelButton from "./components/UI/PixelButton.js";

const HomePage: Component = () => (
  <PixelPanel title="PlayTheGlobe">
    <div class="flex flex-col gap-2 items-center text-center">
      <p class="text-accent-blue">The toughest geography guessing game on earth.</p>
      <p class="text-white mt-1">Ready to test your geographic intelligence on our interactive retro globe?</p>
      <div class="mt-3">
        <A_Link href="/play">
          <PixelButton label="Start Guessing" />
        </A_Link>
      </div>
    </div>
  </PixelPanel>
);

const LoginPage: Component = () => (
  <PixelPanel title="Player Login">
    <div class="flex flex-col gap-2">
      <p class="text-white">Credentials authentication verification screen.</p>
      <div class="mt-2 flex gap-2">
        <A_Link href="/register">
          <PixelButton variant="secondary" label="Go to Register" />
        </A_Link>
      </div>
    </div>
  </PixelPanel>
);

const RegisterPage: Component = () => (
  <PixelPanel title="Player Registration">
    <div class="flex flex-col gap-2">
      <p class="text-white">Create a new unique global account identifier.</p>
      <div class="mt-2 flex gap-2">
        <A_Link href="/login">
          <PixelButton variant="secondary" label="Go to Login" />
        </A_Link>
      </div>
    </div>
  </PixelPanel>
);

const PlayPage: Component = () => (
  <div class="flex flex-col gap-3">
    <PixelPanel title="Landmark Target Clues">
      <p class="text-accent-yellow">Round 1/5</p>
      <p class="text-white mt-1">Eiffel Tower - Paris, France.</p>
    </PixelPanel>
    <PixelPanel title="Interactive 3D WebGL Globe View" class="mt-2">
      <div 
        style={{
          "min-height": "300px", 
          "background": "var(--color-dark)",
          "display": "flex",
          "align-items": "center",
          "justify-content": "center"
        }}
      >
        <span class="pixel-float" style={{ "font-size": "32px" }}>🌍</span>
      </div>
    </PixelPanel>
  </div>
);

const LeaderboardPage: Component = () => (
  <PixelPanel title="Global Leaderboards">
    <div class="flex flex-col gap-2">
      <p class="text-primary">Rankings reset monthly. Top Geographers:</p>
      <ul style={{ "list-style": "none", "padding": "0" }} class="mt-2 flex flex-col gap-1">
        <li>#1 explorer - 45,200 pts 🔥</li>
        <li>#2 atlas_master - 38,100 pts 🔥</li>
        <li>#3 globetrotter - 31,900 pts</li>
      </ul>
    </div>
  </PixelPanel>
);

const CollectionPage: Component = () => (
  <PixelPanel title="Country Collection Map">
    <div class="flex flex-col gap-2 text-center">
      <p class="text-accent-pink">Total Collected: 0/250 Countries</p>
      <p class="text-white mt-1">Unlock countries by guessing landmarks correctly during gameplay.</p>
    </div>
  </PixelPanel>
);

const ProfilePage: Component = () => (
  <PixelPanel title="Player Profile">
    <div class="flex flex-col gap-2">
      <p class="text-white">Username: explorer</p>
      <p class="text-primary">Best Streak: 12 rounds</p>
    </div>
  </PixelPanel>
);

// Inline helper for router link because SolidJS Router exports it
import { A as A_Link } from "@solidjs/router";

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={PageWrapper}>
        <Route path="" component={HomePage} />
        <Route path="login" component={LoginPage} />
        <Route path="register" component={RegisterPage} />
        <Route path="play" component={PlayPage} />
        <Route path="leaderboard" component={LeaderboardPage} />
        <Route path="collection" component={CollectionPage} />
        <Route path="profile" component={ProfilePage} />
      </Route>
    </Router>
  );
};

export default App;
