import { AppError } from "../utils/AppError.js";

// necesita que ya haya corrido requireAuth antes
export function requireAdmin(req, res, next) {
  if (req.usuario?.rol !== "admin") {
    return next(new AppError(403, "Requiere permisos de administrador."));
  }
  next();
}
