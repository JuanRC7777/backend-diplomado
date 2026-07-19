import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autenticado." });
  }
  try {
    req.usuario = verifyAccessToken(header.slice(7));
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
}
