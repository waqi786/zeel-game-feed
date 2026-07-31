import multer from "multer";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { MAX_FILE_SIZE_BYTES } from "../utils/constants.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()),
  filename: (_req, file, cb) => {
    const safeBase = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${randomUUID()}-${safeBase}`);
  }
});

export const uploadGameFiles = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "file" && !file.originalname.toLowerCase().endsWith(".zip")) {
      return cb(new Error("Game file must be a ZIP archive"));
    }
    if (file.fieldname === "thumbnail" && !/^image\/(png|jpe?g|webp)$/i.test(file.mimetype)) {
      return cb(new Error("Thumbnail must be PNG, JPG, or WEBP"));
    }
    cb(null, true);
  }
}).fields([
  { name: "file", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]);
