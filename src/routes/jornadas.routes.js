import { Router } from "express";
import { index, show, create, update, remove } from "../controllers/jornadas.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireOwner } from "../middleware/requireOwner.js";
import { validateJornadaBody } from "../validators/jornada.validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Jornada } from "../models/index.js";

const router = Router();

router.get("/", asyncHandler(index));
router.get("/:id", asyncHandler(show));

router.post("/", requireAuth, validateJornadaBody, asyncHandler(create));
router.put("/:id", requireAuth, requireOwner(Jornada, "Jornada"), validateJornadaBody, asyncHandler(update));
router.delete("/:id", requireAuth, requireOwner(Jornada, "Jornada"), asyncHandler(remove));

export default router;
