// Shared TypeScript definitions for PlayTheGlobe

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
}

// Database models representing SurrealDB tables
export interface DbUser {
  id: string; // e.g. 'users:id'
  username: string;
  password_hash: string;
  created_at: Date;
  total_points: number;
  current_streak: number;
  best_streak: number;
  countries_collected: string[]; // array of country codes
  season_points: number;
}

export interface LeaderboardRow {
  username: string;
  total_points: number;
  best_streak: number;
  countries_collected_count: number;
  global_score: number;
}

export interface DbGameSession {
  id: string;
  user_id: string;
  mode: string;
  country_code: string;
  hints_used: number;
  points_earned: number;
  won: boolean;
  created_at: Date;
}

export interface CountryMastery {
  id: string;
  user_id: string;
  country_code: string;
  correct_count: number;
  hints_used_total: number;
  mastery_tier: "bronze" | "silver" | "gold" | "platinum";
}

export interface Season {
  id: string;
  season_number: number;
  start_date: Date;
  end_date: Date;
  active: boolean;
}

export interface SeasonScore {
  id: string;
  user_id: string;
  season_id: string;
  points: number;
  streak: number;
  rank: number;
}

export interface Duel {
  id: string;
  challenger_id: string;
  opponent_id: string;
  country_code: string;
  winner_id?: string;
  status: "pending" | "active" | "complete";
  created_at: Date;
}

export interface GauntletDaily {
  id: string;
  date: string; // e.g. 'YYYY-MM-DD'
  countries: string[]; // 5 country codes
}

export interface GauntletScore {
  id: string;
  user_id: string;
  date: string; // e.g. 'YYYY-MM-DD'
  points: number;
  completed: boolean;
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  country: string;
  category: string; // e.g. 'historic', 'nature', 'modern'
}

export interface GameSession {
  id: string;
  userId: string;
  score: number;
  startedAt: Date;
  completedAt?: Date;
  rounds: GameRound[];
}

export interface GameRound {
  roundNumber: number;
  targetLandmark: Landmark;
  guessedLatitude?: number;
  guessedLongitude?: number;
  distanceKm?: number;
  scoreEarned?: number;
}

// Socket.io event payloads
export interface ServerToClientEvents {
  gameStarted: (session: GameSession) => void;
  roundStarted: (round: GameRound) => void;
  roundEnded: (result: { distanceKm: number; scoreEarned: number }) => void;
  gameEnded: (finalScore: number) => void;
  playerCountUpdated: (count: number) => void;
}

export interface ClientToServerEvents {
  joinGame: (userId: string) => void;
  submitGuess: (payload: { latitude: number; longitude: number }) => void;
  nextRound: () => void;
}
