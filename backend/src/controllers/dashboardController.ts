import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import { AppError } from "../middlewares/errorHandler.js";
import { prisma } from "../utils/prisma.js";

export async function getDashboardStats(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const games = await prisma.game.findMany({
    where: { authorId: req.user.id },
    include: {
      _count: { select: { likes: true, comments: true, gamePlays: true } },
      gamePlays: {
        where: { createdAt: { gte: daysAgo(7) } },
        select: { durationSeconds: true, userId: true, ip: true, createdAt: true }
      }
    },
    orderBy: { playCount: "desc" }
  });

  const totalPlays = games.reduce((sum, game) => sum + game.playCount, 0);
  const totalLikes = games.reduce((sum, game) => sum + game._count.likes, 0);
  const allPlays = games.flatMap((game) => game.gamePlays);
  const uniquePlayers = new Set(allPlays.map((play) => play.userId?.toString() ?? play.ip ?? "unknown")).size;
  const avgPlayTime = allPlays.length
    ? Math.round(allPlays.reduce((sum, play) => sum + play.durationSeconds, 0) / allPlays.length)
    : 0;

  const playsPerDay = Array.from({ length: 7 }, (_, offset) => {
    const day = daysAgo(6 - offset);
    const key = day.toISOString().slice(0, 10);
    return {
      date: key,
      plays: allPlays.filter((play) => play.createdAt.toISOString().slice(0, 10) === key).length
    };
  });

  res.json({
    totalPlays,
    totalLikes,
    uniquePlayers,
    avgPlayTime,
    playsPerDay,
    topGames: games.slice(0, 3).map((game) => ({
      uuid: game.uuid,
      title: game.title,
      playCount: game.playCount,
      likesCount: game._count.likes
    }))
  });
}

function daysAgo(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
