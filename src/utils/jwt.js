import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export function signAccessToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES ?? "15m" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

// El refresh token es un valor aleatorio opaco (no un JWT): se guarda en
// BD solo su hash SHA-256, así que si la base se filtra, los tokens no
// quedan reutilizables.
export function generateRefreshToken() {
  const token = crypto.randomBytes(64).toString("hex");
  return { token, hash: hashRefreshToken(token) };
}

export function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
