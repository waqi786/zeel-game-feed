import type { Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../utils/prisma.js";
import { AppError } from "../middlewares/errorHandler.js";

export async function serveGameAsset(uuid: string, wildcardPath: string | undefined, res: Response) {
  const game = await prisma.game.findUnique({ where: { uuid } });
  if (!game || !game.isActive) {
    throw new AppError(404, "Game not found");
  }

  const relativePath = sanitizeAssetPath(wildcardPath || "index.html");
  const base = path.resolve(game.folderPath);
  const target = path.resolve(base, relativePath);
  if (!target.startsWith(base)) {
    throw new AppError(400, "Invalid asset path");
  }

  try {
    await fs.access(target);
  } catch {
    throw new AppError(404, "Game asset not found");
  }

  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  if (target.endsWith(".wasm")) res.type("application/wasm");
  if (target.endsWith(".js")) res.type("application/javascript");
  if (target.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
  return res.sendFile(target);
}

function sanitizeAssetPath(assetPath: string) {
  const cleaned = assetPath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (cleaned.includes("..")) {
    throw new AppError(400, "Invalid asset path");
  }
  return cleaned;
}
