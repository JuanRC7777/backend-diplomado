import { AppError } from "../utils/AppError.js";
import { logWarn, logError } from "../utils/logger.js";

// Middleware de errores, va al final de todo.
// Si es un AppError mandamos el mensaje bonito, si no, uno generico
export function errorHandler(err, req, res, _next) {
  const contexto = { method: req.method, ruta: req.originalUrl };

  if (err instanceof AppError) {
    logWarn(`AppError: ${err.message}`, contexto);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logError(err.stack ?? err.message, contexto);
  res.status(500).json({ error: "Error interno del servidor." });
}
