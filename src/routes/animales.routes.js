import { Router } from "express";
import { index, show, create, update, remove } from "../controllers/animales.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireOwner } from "../middleware/requireOwner.js";
import { upload } from "../middleware/upload.js";
import { validateAnimalBody } from "../validators/animal.validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Animal } from "../models/index.js";

const router = Router();

// consultar
router.get("/", asyncHandler(index));
router.get("/:id", asyncHandler(show));

// crear y editar 
router.post("/", requireAuth, upload.single("foto"), validateAnimalBody, asyncHandler(create));
router.put("/:id", requireAuth, requireOwner(Animal, "Animal"), upload.single("foto"), validateAnimalBody, asyncHandler(update));

router.delete("/:id", requireAuth, requireOwner(Animal, "Animal"), asyncHandler(remove));

export default router;
