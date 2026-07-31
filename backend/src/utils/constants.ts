import path from "node:path";

export const ROOT_DIR = process.cwd();
export const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");
export const GAME_UPLOADS_DIR = path.join(UPLOADS_DIR, "games");
export const THUMBNAIL_UPLOADS_DIR = path.join(UPLOADS_DIR, "thumbnails");
export const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB ?? 50);
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const TOKEN_COOKIE = "token";
