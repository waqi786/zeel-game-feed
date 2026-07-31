import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middlewares/auth.js";
import { AppError } from "../middlewares/errorHandler.js";
import { prisma } from "../utils/prisma.js";

export const GENRES = ["For You", "Action", "Puzzle", "Racing", "2D", "3D", "Funny", "Horror"];

export async function getGenres(req: AuthRequest, res: Response) {
  const followed = req.user
    ? await prisma.followedGenre.findMany({ where: { userId: req.user.id }, select: { genreName: true } })
    : [];
  res.json({ genres: GENRES, followedGenres: followed.map((item) => item.genreName) });
}

export async function toggleGenreFollow(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const { genreName } = z.object({ genreName: z.string().min(2).max(32) }).parse(req.body);
  if (!GENRES.includes(genreName) || genreName === "For You") throw new AppError(400, "Unsupported genre");

  const existing = await prisma.followedGenre.findUnique({
    where: { userId_genreName: { userId: req.user.id, genreName } }
  });
  if (existing) {
    await prisma.followedGenre.delete({ where: { id: existing.id } });
  } else {
    await prisma.followedGenre.create({ data: { userId: req.user.id, genreName } });
  }
  res.json({ genreName, following: !existing });
}
