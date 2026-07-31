import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signToken } from "../utils/jwt.js";
import { TOKEN_COOKIE } from "../utils/constants.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { AuthRequest } from "../middlewares/auth.js";
import { awardDailyLogin, calculateLevel } from "../services/gamification.service.js";

const authSchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/).optional(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128)
});

export async function register(req: AuthRequest, res: Response) {
  const data = authSchema.required({ username: true }).parse(req.body);
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] }
  });
  if (existing) throw new AppError(409, "Email or username already exists");

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: await hashPassword(data.password),
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(data.username)}`
    },
    select: publicUserSelect
  });

  setAuthCookie(res, signToken({ userId: user.id, uuid: user.uuid }));
  await awardDailyLogin(user.id);
  res.status(201).json({ user: { ...user, level: calculateLevel(user.xp) } });
}

export async function login(req: AuthRequest, res: Response) {
  const data = authSchema.omit({ username: true }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !(await comparePassword(data.password, user.passwordHash))) {
    throw new AppError(401, "Invalid email or password");
  }

  setAuthCookie(res, signToken({ userId: user.id, uuid: user.uuid }));
  await awardDailyLogin(user.id);
  const { passwordHash: _passwordHash, ...publicUser } = user;
  res.json({ user: { ...publicUser, level: calculateLevel(publicUser.xp) } });
}

export async function logout(_req: AuthRequest, res: Response) {
  res.clearCookie(TOKEN_COOKIE);
  res.json({ message: "Logged out" });
}

export async function me(req: AuthRequest, res: Response) {
  res.json({ user: req.user ? { ...req.user, level: calculateLevel(req.user.xp) } : null });
}

function setAuthCookie(res: Response, token: string) {
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

const publicUserSelect = {
  id: true,
  uuid: true,
  username: true,
  email: true,
  avatar: true,
  bio: true,
  themePreference: true,
  xp: true,
  streakCount: true,
  createdAt: true,
  updatedAt: true
} as const;
