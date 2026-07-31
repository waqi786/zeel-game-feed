import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middlewares/auth.js";
import { AppError } from "../middlewares/errorHandler.js";
import { prisma } from "../utils/prisma.js";

const collectionSchema = z.object({ name: z.string().trim().min(2).max(48) });

export async function getCollections(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  await ensureDefaultCollection(req.user.id);
  const collections = await prisma.collection.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "asc" },
    include: {
      games: {
        include: {
          game: {
            include: {
              author: { select: { username: true, avatar: true, uuid: true } },
              _count: { select: { likes: true, comments: true } }
            }
          }
        }
      }
    }
  });
  res.json({
    collections: collections.map((collection) => ({
      uuid: collection.uuid,
      name: collection.name,
      gamesCount: collection.games.length,
      games: collection.games.map((item) => ({
        uuid: item.game.uuid,
        title: item.game.title,
        genre: item.game.genre,
        playCount: item.game.playCount,
        likesCount: item.game._count.likes,
        commentsCount: item.game._count.comments,
        author: item.game.author
      }))
    }))
  });
}

export async function createCollection(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const data = collectionSchema.parse(req.body);
  const collection = await prisma.collection.create({
    data: { name: data.name, userId: req.user.id }
  });
  res.status(201).json({ collection });
}

export async function saveGameToCollection(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const { collectionUuid, gameUuid } = z
    .object({ collectionUuid: z.string().optional(), gameUuid: z.string() })
    .parse(req.body);
  const collection = collectionUuid
    ? await prisma.collection.findFirst({ where: { uuid: collectionUuid, userId: req.user.id } })
    : await ensureDefaultCollection(req.user.id);
  if (!collection) throw new AppError(404, "Collection not found");

  const game = await prisma.game.findUnique({ where: { uuid: gameUuid } });
  if (!game) throw new AppError(404, "Game not found");

  const existing = await prisma.collectionGame.findUnique({
    where: { collectionId_gameId: { collectionId: collection.id, gameId: game.id } }
  });
  if (existing) {
    await prisma.collectionGame.delete({ where: { id: existing.id } });
  } else {
    await prisma.collectionGame.create({ data: { collectionId: collection.id, gameId: game.id } });
  }
  res.json({ saved: !existing, collectionUuid: collection.uuid });
}

async function ensureDefaultCollection(userId: number) {
  return prisma.collection.upsert({
    where: { userId_name: { userId, name: "Default" } },
    update: {},
    create: { userId, name: "Default" }
  });
}
