import "dotenv/config";
import type { Response, Request, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const TOKEN_TTL_SECONDS = 60 * 30;
const ALGORITHM = "HS256";
const SECRET = process.env.SECRET;
if (!SECRET) throw new Error("SECRET is not set");

// Basic authentication logic taken from
// https://www.topcoder.com/thrive/articles/authentication-and-authorization-in-express-js-api-using-jwt

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, SECRET!, {
    algorithm: ALGORITHM,
    expiresIn: TOKEN_TTL_SECONDS,
  });
}

/** The header is expected to contain `JWT <token>` for authorization */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("JWT ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), SECRET!, {
      algorithms: [ALGORITHM],
    }) as JwtPayload;
    if (typeof payload.sub !== "string") throw new Error("Malformed token");
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireSelf(req: Request, res: Response, next: NextFunction) {
  if (req.params.id !== req.userId) {
    res.status(403).json({ error: "You can only modify your own account" });
    return;
  }
  next();
}
