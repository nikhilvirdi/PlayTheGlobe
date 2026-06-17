import jwt from "jsonwebtoken";
import type { JWTPayload } from "@playtheglobe/types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

/**
 * Signs a JWT token containing the user ID and username, expiring in 30 days.
 */
export function signToken(userId: string, username: string): string {
  const payload: JWTPayload = { userId, username };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

/**
 * Verifies a JWT token and returns its decoded payload.
 * Throws an error if token is invalid or expired.
 */
export function verifyToken(token: string): JWTPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded as JWTPayload;
}
