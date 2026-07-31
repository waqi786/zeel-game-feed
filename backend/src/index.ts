import "dotenv/config";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs/promises";
import { apiRoutes } from "./routes/index.js";
import { attachUser } from "./middlewares/auth.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { GAME_UPLOADS_DIR, THUMBNAIL_UPLOADS_DIR, UPLOADS_DIR } from "./utils/constants.js";
import { recalculateHotness } from "./services/hotness.service.js";

const app = express();
const port = Number(process.env.PORT ?? 5000);
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

await Promise.all([
  fs.mkdir(GAME_UPLOADS_DIR, { recursive: true }),
  fs.mkdir(THUMBNAIL_UPLOADS_DIR, { recursive: true })
]);

app.set("trust proxy", 1);
app.use(compression());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    xFrameOptions: false,
    contentSecurityPolicy: false
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Blocked by CORS"));
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(UPLOADS_DIR), { maxAge: "30d", immutable: true }));
app.use(attachUser);
app.get("/health", (_req, res) => res.json({ status: "ok", app: "ZEEL" }));
app.use("/api/v1", apiRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`ZEEL backend running on http://localhost:${port}`);
});

void recalculateHotness().catch((error) => console.error("Hotness recalculation failed", error));
setInterval(() => {
  void recalculateHotness().catch((error) => console.error("Hotness recalculation failed", error));
}, 60 * 60 * 1000);
