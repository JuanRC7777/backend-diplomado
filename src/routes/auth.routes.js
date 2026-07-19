import { Router } from "express";
import { register, login, refresh, logout, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// registro
router.post("/register", authLimiter, asyncHandler(register));
//login
router.post("/login", authLimiter, asyncHandler(login));

router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
// ver perfil
router.get("/me", requireAuth, asyncHandler(me));

export default router;
