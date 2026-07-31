import AdmZip from "adm-zip";
import fs from "node:fs/promises";
import path from "node:path";
import { GAME_UPLOADS_DIR, MAX_FILE_SIZE_BYTES } from "../utils/constants.js";
import { AppError } from "../middlewares/errorHandler.js";

export async function extractGameZip(zipPath: string, uuid: string) {
  const destination = path.join(GAME_UPLOADS_DIR, uuid);
  await fs.mkdir(destination, { recursive: true });

  let zip: AdmZip;
  try {
    zip = new AdmZip(zipPath);
  } catch {
    await fs.rm(destination, { recursive: true, force: true });
    throw new AppError(400, "Invalid game archive");
  }

  const entries = zip.getEntries();
  const hasRootIndex = entries.some((entry) => normalizeZipName(entry.entryName) === "index.html");
  if (!hasRootIndex) {
    await fs.rm(destination, { recursive: true, force: true });
    throw new AppError(400, "ZIP root must contain index.html");
  }

  let extractedBytes = 0;
  for (const entry of entries) {
    const normalized = normalizeZipName(entry.entryName);
    if (!normalized || normalized.startsWith("../") || path.isAbsolute(normalized)) {
      await fs.rm(destination, { recursive: true, force: true });
      throw new AppError(400, "Unsafe file path inside ZIP");
    }

    const target = path.resolve(destination, normalized);
    if (!target.startsWith(path.resolve(destination))) {
      await fs.rm(destination, { recursive: true, force: true });
      throw new AppError(400, "Unsafe file path inside ZIP");
    }

    if (entry.isDirectory) {
      await fs.mkdir(target, { recursive: true });
      continue;
    }

    extractedBytes += entry.header.size;
    if (extractedBytes > MAX_FILE_SIZE_BYTES) {
      await fs.rm(destination, { recursive: true, force: true });
      throw new AppError(400, "Extracted game exceeds 50MB limit");
    }

    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, entry.getData());
  }

  return destination;
}

function normalizeZipName(name: string) {
  return name.replace(/\\/g, "/").replace(/^\/+/, "");
}
