import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { gameRoutes } from "./gameRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { getGenres, toggleGenreFollow } from "../controllers/genreController.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  createCollection,
  getCollections,
  saveGameToCollection
} from "../controllers/collectionController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { gameOgImage } from "../controllers/ogController.js";

export const apiRoutes = Router();
const genreRoutes = Router();
const collectionRoutes = Router();
const dashboardRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/games", gameRoutes);

genreRoutes.get("/", asyncHandler(getGenres));
genreRoutes.post("/follow", requireAuth, asyncHandler(toggleGenreFollow));
apiRoutes.use("/genres", genreRoutes);

collectionRoutes.get("/", requireAuth, asyncHandler(getCollections));
collectionRoutes.post("/", requireAuth, asyncHandler(createCollection));
collectionRoutes.post("/save", requireAuth, asyncHandler(saveGameToCollection));
apiRoutes.use("/collections", collectionRoutes);

dashboardRoutes.get("/stats", requireAuth, asyncHandler(getDashboardStats));
apiRoutes.use("/dashboard", dashboardRoutes);

apiRoutes.get("/og/game/:uuid", asyncHandler(gameOgImage));
