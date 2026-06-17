import dotenv from "dotenv";
// Load env vars at the top of the file
dotenv.config();

import { Surreal } from "surrealdb";

const db = new Surreal();

const SURREALDB_URL = process.env.SURREALDB_URL || "http://localhost:8000";
const SURREALDB_USER = process.env.SURREALDB_USER || "root";
const SURREALDB_PASS = process.env.SURREALDB_PASS || "root";

export async function connectDB(): Promise<void> {
  try {
    // 1. Connect to SurrealDB instance
    // Note: If using HTTP/HTTPS scheme, SurrealDB library resolves the protocol correctly.
    await db.connect(SURREALDB_URL);

    // 2. Select namespace and database
    await db.use({ namespace: "playtheglobe", database: "playtheglobe" });

    // 3. Sign in with system credentials
    await db.signin({
      username: SURREALDB_USER,
      password: SURREALDB_PASS,
    });

    console.log("CONNECTED: Successfully established session with SurrealDB.");
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR: Failed to connect to SurrealDB:", error);
    throw error;
  }
}

export default db;
