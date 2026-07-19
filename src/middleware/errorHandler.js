import { AppError } from "../utils/AppError.js";

// Middleware de errores, va al final de todo.
// Si es un AppError mandamos el mensaje bonito, si no, uno generico
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
}
