import { Router } from "express";
import { index, actualizarEstado } from "../controllers/usuarios.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// solo administradores
router.get("/", requireAuth, requireAdmin, asyncHandler(index));
router.patch("/:id", requireAuth, requireAdmin, asyncHandler(actualizarEstado));

export default router;
