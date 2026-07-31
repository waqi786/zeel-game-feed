import type { Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { GAME_UPLOADS_DIR, MAX_FILE_SIZE_MB, THUMBNAIL_UPLOADS_DIR } from "../utils/constants.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { AuthRequest } from "../middlewares/auth.js";
import { extractGameZip } from "../services/fileExtraction.service.js";
import { serveGameAsset } from "../services/gameLoader.service.js";
import { awardXp, ensureBadge, maybeAwardPlayXp, XP_REWARDS } from "../services/gamification.service.js";
import { calculateHotness } from "../services/hotness.service.js";

const uploadSchema = z.object({
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  genre: z.string().trim().min(2).max(32).optional()
});

type MulterFiles = {
  file?: Express.Multer.File[];
  thumbnail?: Express.Multer.File[];
};

const RECENT_FEED_LIMIT = 700;
const recentFeedByClient = new Map<string, string[]>();

export async function getFeed(req: AuthRequest, res: Response) {
  const limit = Math.min(Number(req.query.limit ?? 10), 20);
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const exclude =
    typeof req.query.exclude === "string"
      ? req.query.exclude.split(",").map((id) => id.trim()).filter(Boolean).slice(0, 1000)
      : [];
  const mode = req.query.mode === "following" ? "following" : "for-you";
  const orderBy = mode === "following" ? { createdAt: "desc" as const } : { hotnessScore: "desc" as const };

  if (mode === "following" && req.user) {
    const followed = await prisma.followedGenre.findMany({
      where: { userId: req.user.id },
      select: { genreName: true }
    });
    const followedGenres = followed.map((item) => item.genreName);
    if (followedGenres.length) {
      const followedGames = await prisma.game.findMany({
        where: { isActive: true, genre: { in: followedGenres } },
        take: limit + 1,
        ...(cursor ? { cursor: { uuid: cursor }, skip: 1 } : {}),
        orderBy,
        include: gameInclude(req.user.id)
      });
      const hasMore = followedGames.length > limit;
      const page = hasMore ? followedGames.slice(0, limit) : followedGames;
      return res.json({ games: page.map(toGameDto), nextCursor: hasMore ? page.at(-1)?.uuid : null });
    }
  }

  if (mode === "for-you") {
    const requestSeed = feedSeed(req);
    const clientKey = feedClientKey(req);
    const recent = recentFeedByClient.get(clientKey) ?? [];
    const excludeWithRecent = uniqueStrings([...exclude, ...recent]).slice(-1400);

    // Only the hand-crafted "real" games (zeel-real-*) are genuinely fun/polished.
    // The 10k procedural zeel-game-* entries are generic filler, so the feed now
    // serves exclusively from the curated real games and rotates through all of
    // them before repeating, based on this client's recent/exclude history.
    const realBaseWhere = { isActive: true, uuid: { startsWith: "zeel-real-" } };
    const realExcludeWhere = { ...realBaseWhere, uuid: { startsWith: "zeel-real-", notIn: excludeWithRecent } };
    const realFallbackWhere = { ...realBaseWhere, uuid: { startsWith: "zeel-real-", notIn: exclude } };
    const realExcludeAvailable = await prisma.game.count({ where: realExcludeWhere });
    const where = realExcludeAvailable > 0 ? realExcludeWhere : realFallbackWhere;
    const available = await prisma.game.count({ where });
    if (!available) {
      // Every real game has been seen recently; reset and serve from the full pool.
      const allReal = await prisma.game.findMany({ where: realBaseWhere, include: gameInclude(req.user?.id) });
      const page = shuffleGameRows(allReal, requestSeed).slice(0, limit);
      rememberFeedPage(clientKey, page);
      return res.json({ games: page.map(toGameDto), nextCursor: page.length ? page.at(-1)?.uuid ?? null : null });
    }

    const rows = await prisma.game.findMany({
      where,
      take: Math.min(limit, available),
      include: gameInclude(req.user?.id)
    });
    const page = shuffleGameRows(dedupeGameRows(rows), requestSeed).slice(0, limit);
    rememberFeedPage(clientKey, page);
    return res.json({ games: page.map(toGameDto), nextCursor: available > limit ? page.at(-1)?.uuid ?? null : null });
  }



  const games = await prisma.game.findMany({
    where: { isActive: true },
    take: limit + 1,
    ...(cursor ? { cursor: { uuid: cursor }, skip: 1 } : {}),
    orderBy,
    include: gameInclude(req.user?.id)
  });

  const hasMore = games.length > limit;
  const page = hasMore ? games.slice(0, limit) : games;
  res.json({
    games: page.map(toGameDto),
    nextCursor: hasMore ? page.at(-1)?.uuid : null
  });
}

export async function getGame(req: AuthRequest, res: Response) {
  const game = await prisma.game.update({
    where: { uuid: req.params.uuid },
    data: { playCount: { increment: 1 } },
    include: {
      author: { select: { username: true, avatar: true, uuid: true } },
      likes: req.user ? { where: { userId: req.user.id }, select: { id: true } } : false,
      _count: { select: { likes: true, comments: true } }
    }
  });
  res.json({ game: toGameDto(game) });
}

export async function uploadGame(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const data = uploadSchema.parse(req.body);
  const files = req.files as MulterFiles | undefined;
  const zipFile = files?.file?.[0];
  if (!zipFile) throw new AppError(400, "ZIP game file is required");

  const uuid = randomUUID();
  let folderPath = "";
  let thumbnailPath: string | undefined;

  try {
    folderPath = await extractGameZip(zipFile.path, uuid);
    const thumbnail = files?.thumbnail?.[0];
    if (thumbnail) {
      const ext = path.extname(thumbnail.originalname).toLowerCase() || ".jpg";
      const thumbnailName = `${uuid}${ext}`;
      const target = path.join(THUMBNAIL_UPLOADS_DIR, thumbnailName);
      await fs.mkdir(THUMBNAIL_UPLOADS_DIR, { recursive: true });
      await fs.rename(thumbnail.path, target);
      thumbnailPath = `/uploads/thumbnails/${thumbnailName}`;
    }

    const game = await prisma.game.create({
      data: {
        uuid,
        title: data.title,
        description: data.description,
        genre: data.genre ?? "Action",
        folderPath,
        thumbnailPath,
        fileSizeMB: Number((zipFile.size / 1024 / 1024).toFixed(2)),
        authorId: req.user.id
      },
      include: {
        author: { select: { username: true, avatar: true, uuid: true } },
        likes: { where: { userId: req.user.id }, select: { id: true } },
        _count: { select: { likes: true, comments: true } }
      }
    });
    await awardXp(req.user.id, XP_REWARDS.upload);
    await ensureBadge(req.user.id, "first-game");

    res.status(201).json({ game: toGameDto(game) });
  } catch (error) {
    if (folderPath) await fs.rm(folderPath, { recursive: true, force: true });
    throw error;
  } finally {
    await fs.rm(zipFile.path, { force: true });
  }
}

export async function deleteGame(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const game = await prisma.game.findUnique({ where: { uuid: req.params.uuid } });
  if (!game) throw new AppError(404, "Game not found");
  if (game.authorId !== req.user.id) throw new AppError(403, "Only the author can delete this game");

  await prisma.game.delete({ where: { uuid: req.params.uuid } });
  await fs.rm(path.join(GAME_UPLOADS_DIR, req.params.uuid), { recursive: true, force: true });
  res.json({ message: "Game deleted" });
}

export async function toggleLike(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, "Authentication required");
  const game = await prisma.game.findUnique({ where: { uuid: req.params.uuid } });
  if (!game) throw new AppError(404, "Game not found");

  const existing = await prisma.like.findUnique({
    where: { userId_gameId: { userId: req.user.id, gameId: game.id } }
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { userId: req.user.id, gameId: game.id } });
    await awardXp(req.user.id, XP_REWARDS.like);
  }

  const likesCount = await prisma.like.count({ where: { gameId: game.id } });
  await prisma.game.update({
    where: { id: game.id },
    data: {
      hotnessScore: calculateHotness({ likesCount, playCount: game.playCount, createdAt: game.createdAt })
    }
  });
  res.json({ liked: !existing, likesCount });
}

export async function recordGamePlay(req: AuthRequest, res: Response) {
  const body = z.object({ durationSeconds: z.number().int().min(0).max(86400).default(0) }).parse(req.body);
  const game = await prisma.game.findUnique({
    where: { uuid: req.params.uuid },
    include: { _count: { select: { likes: true } } }
  });
  if (!game) throw new AppError(404, "Game not found");

  const updated = await prisma.game.update({
    where: { id: game.id },
    data: {
      playCount: { increment: 1 },
      hotnessScore: calculateHotness({
        likesCount: game._count.likes,
        playCount: game.playCount + 1,
        createdAt: game.createdAt
      })
    }
  });

  await prisma.gamePlay.create({
    data: {
      gameId: game.id,
      userId: req.user?.id,
      ip: req.ip,
      durationSeconds: body.durationSeconds
    }
  });
  await maybeAwardPlayXp(req.user?.id, body.durationSeconds);
  if (updated.playCount >= 100) {
    await ensureBadge(game.authorId, "popular");
  }

  res.json({ playCount: updated.playCount });
}

export async function serveGame(req: AuthRequest, res: Response) {
  return serveGameAsset(req.params.uuid, req.params[0], res);
}

function toGameDto(game: any) {
  return {
    uuid: game.uuid,
    title: game.title,
    description: game.description,
    thumbnailPath: game.thumbnailPath,
    genre: game.genre,
    hotnessScore: game.hotnessScore,
    fileSizeMB: game.fileSizeMB,
    playCount: game.playCount,
    createdAt: game.createdAt,
    author: game.author,
    likesCount: game._count?.likes ?? 0,
    commentsCount: game._count?.comments ?? 0,
    savesCount: Math.max(game._count?.collections ?? 0, Math.floor(game.playCount * 0.018)),
    sharesCount: Math.max(game._count?.comments ?? 0, Math.floor(game.playCount * 0.032)),
    likedByMe: Array.isArray(game.likes) ? game.likes.length > 0 : false,
    gameUrl: `/api/v1/games/serve/${game.uuid}/index.html`,
    shareUrl: `/games/${game.uuid}`
  };
}

function gameInclude(userId?: number) {
  return {
    author: { select: { username: true, avatar: true, uuid: true } },
    likes: userId ? { where: { userId }, select: { id: true } } : false,
    _count: { select: { likes: true, comments: true, collections: true } }
  };
}

function dedupeGameRows(games: any[]) {
  return [...new Map(games.map((game) => [game.uuid, game])).values()];
}

function mixGameRows(games: any[], seed = Date.now()) {
  const buckets = games.reduce<Record<string, any[]>>((acc, game) => {
    const key = `${game.genre}:${titleFamily(game.title)}`;
    acc[key] = acc[key] ?? [];
    acc[key].push(game);
    return acc;
  }, {});
  for (const key of Object.keys(buckets)) {
    buckets[key].sort((a, b) => seededRank(`${seed}:${a.uuid}`) - seededRank(`${seed}:${b.uuid}`));
  }
  const mixed: any[] = [];
  let previousFamily = "";
  let keys = Object.keys(buckets).sort((a, b) => seededRank(`${seed}:${a}`) - seededRank(`${seed}:${b}`));
  while (Object.values(buckets).some((bucket) => bucket.length)) {
    for (const key of keys) {
      if (!buckets[key].length || key === previousFamily) continue;
      const next = buckets[key].shift();
      if (next) {
        mixed.push(next);
        previousFamily = key;
      }
    }
    keys = keys.filter((key) => buckets[key].length);
    if (keys.length === 1 && keys[0] === previousFamily) previousFamily = "";
  }
  return dedupeGameRows(mixed);
}

function interleaveRealGames(games: any[], realGames: any[]) {
  if (!realGames.length) return games;
  const result: any[] = [];
  const realQueue = [...realGames];
  const spacing = Math.max(4, Math.floor(games.length / Math.max(realGames.length, 1)) || 6);
  let sinceLastReal = spacing - 1; // ensure a real game appears fairly early
  for (const game of games) {
    result.push(game);
    sinceLastReal += 1;
    if (sinceLastReal >= spacing && realQueue.length) {
      result.push(realQueue.shift());
      sinceLastReal = 0;
    }
  }
  while (realQueue.length) result.push(realQueue.shift());
  return dedupeGameRows(result);
}

function spreadAcrossBaseGames(games: any[]) {

  const uniqueBase: any[] = [];
  const deferred: any[] = [];
  const seenBase = new Set<string>();
  for (const game of games) {
    const base = baseTitle(game.title);
    if (seenBase.has(base)) deferred.push(game);
    else {
      seenBase.add(base);
      uniqueBase.push(game);
    }
  }
  return [...uniqueBase, ...deferred];
}

function baseTitle(title: string) {
  return title.replace(/\s+\d+$/, "").trim().toLowerCase();
}

function rememberFeedPage(clientKey: string, games: any[]) {
  const previous = recentFeedByClient.get(clientKey) ?? [];
  recentFeedByClient.set(clientKey, uniqueStrings([...previous, ...games.map((game) => game.uuid)]).slice(-RECENT_FEED_LIMIT));
}

function feedClientKey(req: AuthRequest) {
  return req.user?.uuid ?? req.ip ?? req.get("user-agent") ?? "guest";
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function titleFamily(title: string) {
  const name = title.toLowerCase();
  if (/(shooter|bullet|blast|invader|alien|sniper|war|strike|laser|marine|tank|fighter)/.test(name)) return "shooter";
  if (/(car|kart|moto|drift|race|traffic|highway|road|ramp)/.test(name)) return "racing";
  if (/(football|basket|pool|bowling|penalty|goal|tennis|golf|cricket|rope|launcher)/.test(name)) return "sports";
  if (/(2048|tetris|tile|mahjong|solitaire|candy|word|quiz|match|merge|puzzle|memory|code|prism|painting|color by)/.test(name)) return "puzzle";
  if (/(maze|pac|mine|escape|room|door|labyrinth)/.test(name)) return "maze";
  if (/(snake|grid|ludo|chess|tic|sudoku|whack|mole|bomber|hardest|field|connect|defense)/.test(name)) return "grid";
  if (/(flappy|bird|rocket|flight|blumgi|comet|gravity bird)/.test(name)) return "flappy";
  if (/(jump|doodle|helix|redball|flip|bunny|parkour|climb|leap|yoyo|magma)/.test(name)) return "jump";
  if (/(switch|color|bubble|simon|rgb|zuma|loop)/.test(name)) return "switch";
  if (/(stack|tower|stacktris|flip)/.test(name)) return "stack";
  if (/(block|brick|breaker|pinball)/.test(name)) return "breaker";
  if (/(orbit|orbital|coil|bouncing|ball|circle|spiral)/.test(name)) return "orbit";
  if (/(blade|slice|fruit ninja|slasho|slash|ninja)/.test(name)) return "slice";
  if (/(tunnel|void|vortex|cyclone)/.test(name)) return "tunnel";
  if (/(shadow|kombat|zombie|outbreak|dark)/.test(name)) return "combat";
  if (/(crossy|paper|slither|ziggy|lane|tag|trail|subway|temple|surf|sprint)/.test(name)) return "lane";
  return "runner";
}

function shuffleGameRows(games: any[], seed: number) {
  return [...games]
    .map((game, index) => ({ game, rank: seededRank(`${seed}:${game.uuid}:${index}`) }))
    .sort((a, b) => a.rank - b.rank)
    .map((item) => item.game);
}

function feedSeed(req: AuthRequest) {
  const raw = `${req.user?.uuid ?? req.ip ?? "guest"}:${Date.now()}:${Math.random()}`;
  return seededRank(raw);
}

function seededRank(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export { MAX_FILE_SIZE_MB };
