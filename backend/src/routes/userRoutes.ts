import { Router } from "express";
import { me } from "../controllers/authController.js";
import { getProgress, updateTheme } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const userRoutes = Router();

userRoutes.get("/me", requireAuth, asyncHandler(me));
userRoutes.get("/progress", requireAuth, asyncHandler(getProgress));
userRoutes.patch("/theme", requireAuth, asyncHandler(updateTheme));
