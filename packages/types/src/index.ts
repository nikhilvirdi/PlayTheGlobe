// Shared TypeScript definitions for PlayTheGlobe

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
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
