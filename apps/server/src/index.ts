import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { Surreal } from "surrealdb";
import { Redis } from "@upstash/redis";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { 
  ServerToClientEvents, 
  ClientToServerEvents,
  User,
  GameSession
} from "@playtheglobe/types";

// Load Environment variables
const PORT = process.env.PORT || 3001;
const SURREALDB_URL = process.env.SURREALDB_URL || "http://localhost:8000";
const SURREALDB_USER = process.env.SURREALDB_USER || "root";
const SURREALDB_PASS = process.env.SURREALDB_PASS || "root";
const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL || "";
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || "";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Initialize databases (Placeholders)
const db = new Surreal();
let redis: Redis | null = null;
if (UPSTASH_REDIS_URL && UPSTASH_REDIS_TOKEN) {
  redis = new Redis({
    url: UPSTASH_REDIS_URL,
    token: UPSTASH_REDIS_TOKEN,
  });
}

// App Setup
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Socket.io Setup
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let connectedPlayersCount = 0;

// Socket listeners
io.on("connection", (socket) => {
  connectedPlayersCount++;
  io.emit("playerCountUpdated", connectedPlayersCount);

  console.log(`Socket connected: ${socket.id}. Total: ${connectedPlayersCount}`);

  socket.on("joinGame", (userId: string) => {
    console.log(`Player ${userId} requested to join the game.`);
    
    const session: GameSession = {
      id: `session_${Date.now()}`,
      userId,
      score: 0,
      startedAt: new Date(),
      rounds: []
    };

    socket.emit("gameStarted", session);
  });

  socket.on("submitGuess", (payload) => {
    console.log(`Received guess coordinate: ${payload.latitude}, ${payload.longitude}`);
    // Evaluate guess distance & score
    socket.emit("roundEnded", { distanceKm: 240, scoreEarned: 350 });
  });

  socket.on("nextRound", () => {
    console.log("Ready for next round.");
  });

  socket.on("disconnect", () => {
    connectedPlayersCount = Math.max(0, connectedPlayersCount - 1);
    io.emit("playerCountUpdated", connectedPlayersCount);
    console.log(`Socket disconnected: ${socket.id}. Total: ${connectedPlayersCount}`);
  });
});

// Health Checks & Base API
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    dbConnected: db.status === "opened", 
    cacheEnabled: redis !== null 
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "PlayTheGlobe REST & Socket Server is running." 
  });
});

// Authentication Mock APIs
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ error: "Missing registration credentials." });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // Future step: save to SurrealDB
    res.status(201).json({ message: "User registered successfully.", hash: passwordHash });
  } catch (error) {
    res.status(500).json({ error: "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  // Future step: Fetch from db, verify password hash
  const mockUser: User = {
    id: "user_mock123",
    username: "explorer_one",
    email: email || "explorer@playtheglobe.com",
    createdAt: new Date(),
  };

  const token = jwt.sign({ userId: mockUser.id }, JWT_SECRET, { expiresIn: "24h" });
  res.status(200).json({ token, user: mockUser });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 PlayTheGlobe server is listening on port ${PORT}`);
});
