import { Router } from "express";
import { index, create } from "../controllers/solicitudes.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// cualquiera puede solicitar informacion de adopcion
router.post("/", asyncHandler(create));

// solo admin puede ver las solicitudes
router.get("/", requireAuth, requireAdmin, asyncHandler(index));

export default router;
