import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import { AppError } from "../middlewares/errorHandler.js";
import { prisma } from "../utils/prisma.js";

export async function gameOgImage(req: AuthRequest, res: Response) {
  const game = await prisma.game.findUnique({
    where: { uuid: req.params.uuid },
    include: { author: { select: { username: true } }, _count: { select: { likes: true } } }
  });
  if (!game) throw new AppError(404, "Game not found");
  const svg = buildSvg({
    title: game.title,
    creator: game.author.username,
    plays: game.playCount,
    likes: game._count.likes,
    genre: game.genre
  });
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(svg);
}

function buildSvg(data: { title: string; creator: string; plays: number; likes: number; genre: string }) {
  const title = escapeXml(data.title);
  const creator = escapeXml(data.creator);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0A0A0F"/>
      <stop offset="0.52" stop-color="#25111D"/>
      <stop offset="1" stop-color="#101827"/>
    </linearGradient>
    <radialGradient id="pulse" cx="28%" cy="24%" r="58%">
      <stop offset="0" stop-color="#F50575" stop-opacity=".7"/>
      <stop offset=".55" stop-color="#F50575" stop-opacity=".13"/>
      <stop offset="1" stop-color="#F50575" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#pulse)"/>
  <rect x="62" y="58" width="1076" height="514" rx="26" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.16)"/>
  <circle cx="936" cy="204" r="94" fill="#F50575" opacity=".18"/>
  <path d="M905 162 L990 204 L905 246 Z" fill="#F50575"/>
  <text x="96" y="130" fill="#F50575" font-size="42" font-family="Inter,Arial" font-weight="900">ZEEL</text>
  <text x="96" y="288" fill="#fff" font-size="76" font-family="Inter,Arial" font-weight="900">${title}</text>
  <text x="96" y="348" fill="rgba(255,255,255,.72)" font-size="32" font-family="Inter,Arial" font-weight="700">by @${creator} · ${escapeXml(data.genre)}</text>
  <g font-family="Inter,Arial" font-weight="800" font-size="30" fill="#fff">
    <rect x="96" y="430" width="206" height="70" rx="18" fill="rgba(255,255,255,.1)"/>
    <text x="124" y="475">${data.plays.toLocaleString()} plays</text>
    <rect x="326" y="430" width="198" height="70" rx="18" fill="rgba(255,255,255,.1)"/>
    <text x="354" y="475">${data.likes.toLocaleString()} likes</text>
  </g>
</svg>`;
}

function escapeXml(input: string) {
  return input.replace(/[<>&'"]/g, (char) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" };
    return map[char];
  });
}
