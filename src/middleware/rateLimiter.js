import rateLimit from "express-rate-limit";

// Primera capa de defensa contra fuerza bruta, por IP. La segunda capa,
// más fina (por email), vive en auth.controller.js usando la tabla
// login_attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos desde esta red. Intenta de nuevo más tarde." },
});
