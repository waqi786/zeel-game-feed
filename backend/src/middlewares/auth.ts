import type { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { TOKEN_COOKIE } from "../utils/constants.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "./errorHandler.js";

export type AuthRequest = Request & {
  user?: {
    id: number;
    uuid: string;
    username: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    themePreference: string;
    xp: number;
    streakCount: number;
  };
};

export async function attachUser(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const cookieToken = req.cookies?.[TOKEN_COOKIE];
    const header = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined;
    const token = cookieToken ?? header;

    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        uuid: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        themePreference: true,
        xp: true,
        streakCount: true
      }
    });

    if (user) {
      req.user = user;
    }
  } catch {
    req.user = undefined;
  }

  next();
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new AppError(401, "Authentication required"));
  }
  next();
}
