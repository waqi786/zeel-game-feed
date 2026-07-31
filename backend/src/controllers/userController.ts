import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middlewares/auth.js";
import { AppError } from "../middlewares/errorHandler.js";
import { prisma } from "../utils/prisma.js";
import { calculateLevel } from "../services/gamification.service.js";

const themeSchema = z.object({
  themePreference: z.enum(["system", "dark", "light"])
});

export async function updateTheme(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const data = themeSchema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
    select: { themePreference: true, xp: true, streakCount: true }
  });
  res.json({ user: { ...user, level: calculateLevel(user.xp) } });
}

export async function getProgress(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const badges = await prisma.userBadge.findMany({
    where: { userId: req.user.id },
    include: { badge: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({
    xp: req.user.xp,
    level: calculateLevel(req.user.xp),
    streakCount: req.user.streakCount,
    badges: badges.map((item) => item.badge)
  });
}
