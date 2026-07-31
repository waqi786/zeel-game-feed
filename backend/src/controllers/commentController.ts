import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { AuthRequest } from "../middlewares/auth.js";
import { awardXp, XP_REWARDS } from "../services/gamification.service.js";

const commentSchema = z.object({
  content: z.string().trim().min(1).max(600),
  parentId: z.number().int().positive().optional()
});

export async function getComments(req: AuthRequest, res: Response) {
  const game = await prisma.game.findUnique({ where: { uuid: req.params.uuid } });
  if (!game) throw new AppError(404, "Game not found");

  const comments = await prisma.comment.findMany({
    where: { gameId: game.id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { username: true, avatar: true, uuid: true } } }
  });

  res.json({ comments: nestComments(comments) });
}

export async function createComment(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const data = commentSchema.parse(req.body);
  const game = await prisma.game.findUnique({ where: { uuid: req.params.uuid } });
  if (!game) throw new AppError(404, "Game not found");

  if (data.parentId) {
    const parent = await prisma.comment.findFirst({ where: { id: data.parentId, gameId: game.id } });
    if (!parent) throw new AppError(400, "Parent comment not found");
  }

  const comment = await prisma.comment.create({
    data: { content: data.content, parentId: data.parentId, gameId: game.id, userId: req.user.id },
    include: { user: { select: { username: true, avatar: true, uuid: true } } }
  });
  await awardXp(req.user.id, XP_REWARDS.comment);

  res.status(201).json({ comment: { ...comment, replies: [] } });
}

export async function deleteComment(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const commentId = Number(req.params.commentId);
  if (!Number.isInteger(commentId)) throw new AppError(400, "Invalid comment id");

  const game = await prisma.game.findUnique({ where: { uuid: req.params.uuid } });
  if (!game) throw new AppError(404, "Game not found");

  const comment = await prisma.comment.findFirst({
    where: { id: commentId, gameId: game.id },
    select: { id: true, userId: true }
  });
  if (!comment) throw new AppError(404, "Comment not found");
  if (comment.userId !== req.user.id) throw new AppError(403, "Only the author can delete this comment");

  await prisma.comment.delete({ where: { id: comment.id } });
  res.json({ message: "Comment deleted", id: comment.id });
}

function nestComments(comments: any[]) {
  const byId = new Map<number, any>();
  const roots: any[] = [];
  for (const comment of comments) {
    byId.set(comment.id, { ...comment, replies: [] });
  }
  for (const comment of byId.values()) {
    if (comment.parentId && byId.has(comment.parentId)) {
      byId.get(comment.parentId).replies.push(comment);
    } else {
      roots.push(comment);
    }
  }
  return roots;
}
