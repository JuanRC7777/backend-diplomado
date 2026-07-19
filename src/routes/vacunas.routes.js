import { Router } from "express";
import { index } from "../controllers/vacunas.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// catalogo de vacunas, no necesita login
router.get("/", asyncHandler(index));

export default router;
