import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { JWTPayload } from "@playtheglobe/types";

/**
 * Extended Express request interface containing authenticated user payload.
 */
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * Express middleware to verify Bearer JWT and attach payload to request.
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Access Denied: Authorization header must be Bearer token." });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Access Denied: Token not found in header." });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Access Denied: Invalid or expired token." });
  }
}
