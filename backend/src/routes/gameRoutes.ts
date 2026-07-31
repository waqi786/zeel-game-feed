import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  deleteGame,
  getFeed,
  getGame,
  recordGamePlay,
  serveGame,
  toggleLike,
  uploadGame
} from "../controllers/gameController.js";
import { createComment, deleteComment, getComments } from "../controllers/commentController.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { requireAuth } from "../middlewares/auth.js";
import { uploadGameFiles } from "../middlewares/multerConfig.js";

export const gameRoutes = Router();

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

gameRoutes.get("/feed", asyncHandler(getFeed));
gameRoutes.get("/serve/:uuid/*", asyncHandler(serveGame));
gameRoutes.post("/upload", requireAuth, uploadLimiter, uploadGameFiles, asyncHandler(uploadGame));
gameRoutes.post("/:uuid/play", asyncHandler(recordGamePlay));
gameRoutes.get("/:uuid/comments", asyncHandler(getComments));
gameRoutes.post("/:uuid/comments", requireAuth, asyncHandler(createComment));
gameRoutes.delete("/:uuid/comments/:commentId", requireAuth, asyncHandler(deleteComment));
gameRoutes.post("/:uuid/like", requireAuth, asyncHandler(toggleLike));
gameRoutes.get("/:uuid", asyncHandler(getGame));
gameRoutes.delete("/:uuid", requireAuth, asyncHandler(deleteGame));
