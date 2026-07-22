import { Router } from "express";
import { index, create, remove } from "../controllers/vacunas.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// catalogo de vacunas, no necesita login
router.get("/", asyncHandler(index));

// gestion del catalogo, solo admin
router.post("/", requireAuth, requireAdmin, asyncHandler(create));
router.delete("/:id", requireAuth, requireAdmin, asyncHandler(remove));

export default router;
