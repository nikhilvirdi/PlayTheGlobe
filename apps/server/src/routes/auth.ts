import express from "express";
import bcrypt from "bcrypt";
import db from "../db/surreal.js";
import { signToken } from "../utils/jwt.js";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/auth.js";
import type { DbUser, AuthResponse, User } from "@playtheglobe/types";

const router = express.Router();

// Username Validation: 3-20 chars, alphanumeric + underscore
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * POST /api/auth/register
 * Register a new player account.
 */
router.post("/register", async (req, res): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required fields." });
      return;
    }

    if (!USERNAME_REGEX.test(username)) {
      res.status(400).json({ 
        error: "Username must be 3-20 characters long and contain only letters, numbers, and underscores." 
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters long." });
      return;
    }

    // Check username uniqueness
    const checkQuery = await db.query<[DbUser[]]>("SELECT * FROM users WHERE username = $username", {
      username
    });
    const existingUsers = checkQuery[0];
    if (existingUsers && existingUsers.length > 0) {
      res.status(400).json({ error: "Username is already taken by another player." });
      return;
    }

    // Hash password with 12 bcrypt salt rounds
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user into SurrealDB
    const insertResult = await db.create("users", {
      username,
      password_hash: passwordHash,
      created_at: new Date(),
      total_points: 0,
      current_streak: 0,
      best_streak: 0,
      countries_collected: [],
      season_points: 0
    }) as DbUser | DbUser[];

    const newUser = Array.isArray(insertResult) ? insertResult[0] : insertResult;
    
    if (!newUser) {
      throw new Error("Failed to create user record.");
    }

    // Sign JWT token
    const token = signToken(newUser.id, newUser.username);

    // Build sanitised user response (exclude password_hash)
    const userPayload: User = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.created_at
    };

    const responseData: AuthResponse = {
      token,
      user: userPayload
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "An unexpected error occurred during registration." });
  }
});

/**
 * POST /api/auth/login
 * Log in a player using username and password.
 */
router.post("/login", async (req, res): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required fields." });
      return;
    }

    // Fetch user by username
    const checkQuery = await db.query<[DbUser[]]>("SELECT * FROM users WHERE username = $username", {
      username
    });
    const usersList = checkQuery[0];
    const dbUser = usersList?.[0];

    if (!dbUser) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    // Verify password match
    const passwordMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    // Sign JWT token
    const token = signToken(dbUser.id, dbUser.username);

    // Build sanitised user response
    const userPayload: User = {
      id: dbUser.id,
      username: dbUser.username,
      createdAt: dbUser.created_at
    };

    const responseData: AuthResponse = {
      token,
      user: userPayload
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "An unexpected error occurred during login." });
  }
});

/**
 * GET /api/auth/me
 * Retrieve the current authenticated player profile.
 */
router.get("/me", authMiddleware as express.RequestHandler, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized access: Missing session user context." });
      return;
    }

    const userId = req.user.userId;

    // Fetch full user record from SurrealDB by ID
    const queryResult = await db.query<[DbUser[]]>("SELECT * FROM users WHERE id = $userId", {
      userId
    });
    const users = queryResult[0];
    const dbUser = users?.[0];

    if (!dbUser) {
      res.status(404).json({ error: "Player account not found." });
      return;
    }

    // Build sanitised user profile response
    const userPayload: User = {
      id: dbUser.id,
      username: dbUser.username,
      createdAt: dbUser.created_at
    };

    res.status(200).json(userPayload);
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    res.status(500).json({ error: "An unexpected error occurred retrieving player context." });
  }
});

export default router;
