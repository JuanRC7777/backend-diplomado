import { Op } from "sequelize";
import { Usuario, RefreshToken, LoginAttempt } from "../models/index.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { signAccessToken, generateRefreshToken, hashRefreshToken } from "../utils/jwt.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_COOKIE = "refresh_token";
const REFRESH_MAX_AGE_MS = Number(process.env.JWT_REFRESH_EXPIRES_DAYS ?? 7) * 24 * 60 * 60 * 1000;
const MAX_INTENTOS_FALLIDOS = 5;

//opciones de la cookie
function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_MAX_AGE_MS,
    path: "/api/auth",
  };
}

function toPublicUser(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: usuario.telefono ?? undefined,
  };
}

async function issueSession(res, usuario) {

  const accessToken = signAccessToken(usuario);
  const { token, hash } = generateRefreshToken();

  await RefreshToken.create({
    usuario_id: usuario.id,
    token_hash: hash,
    expira_en: new Date(Date.now() + REFRESH_MAX_AGE_MS),
  });

  res.cookie(REFRESH_COOKIE, token, cookieOptions());
  return accessToken;
}

export async function register(req, res) {
  const { nombre, email, telefono, password } = req.body ?? {};

  if (!nombre?.trim() || !EMAIL_RE.test(email ?? "") || !password || password.length < 6) {
    return res.status(400).json({ error: "Datos de registro inválidos." });
  }

  const existente = await Usuario.findOne({ where: { email } });
  if (existente) {
    return res.status(409).json({ error: "Este correo ya está registrado." });
  }

  const password_hash = await hashPassword(password);
  const usuario = await Usuario.create({
    nombre: nombre.trim(),
    email,
    telefono: telefono || null,
    password_hash,
  });

  const accessToken = await issueSession(res, usuario);
  res.status(201).json({ accessToken, user: toPublicUser(usuario) });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  const ip = req.ip;

  if (!EMAIL_RE.test(email ?? "") || !password) {
    return res.status(400).json({ error: "Correo o contraseña inválidos." });
  }
//verificar si ya paso del limite de intentos
  const quinceMinAtras = new Date(Date.now() - 15 * 60 * 1000);
  const intentosFallidos = await LoginAttempt.count({
    where: { email, exitoso: false, creado_en: { [Op.gt]: quinceMinAtras } },
  });
  if (intentosFallidos >= MAX_INTENTOS_FALLIDOS) {
    return res.status(429).json({ error: "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos." });
  }

  const usuario = await Usuario.findOne({ where: { email } });

  // Comparamos siempre contra un hash (aunque el usuario no exista) para
  // no filtrar por temporización si un correo está registrado o no.
  const hashParaComparar =
    usuario?.password_hash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva";
  const passwordValida = await verifyPassword(password, hashParaComparar);

  await LoginAttempt.create({
    email,
    ip_address: ip,
    exitoso: Boolean(usuario && passwordValida),
  });

  if (!usuario || !usuario.activo || !passwordValida) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  const accessToken = await issueSession(res, usuario);
  res.json({ accessToken, user: toPublicUser(usuario) });
}

export async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ error: "Sin sesión activa." });

  const hash = hashRefreshToken(token);
  const registro = await RefreshToken.findOne({
    where: { token_hash: hash },
    include: [{ model: Usuario }],
  });

  const usuarioAsociado = registro?.Usuario;
  const invalido =
    !registro || registro.revocado_en || new Date(registro.expira_en) < new Date() || !usuarioAsociado?.activo;

  if (invalido) {
    res.clearCookie(REFRESH_COOKIE, cookieOptions());
    return res.status(401).json({ error: "Sesión expirada, inicia sesión de nuevo." });
  }

  // Rotación: el refresh token usado se revoca y se emite uno nuevo, para
  // que un token robado y reutilizado deje huella (reuse detection básico).
  registro.revocado_en = new Date();
  await registro.save();

  const accessToken = await issueSession(res, usuarioAsociado);
  res.json({ accessToken, user: toPublicUser(usuarioAsociado) });
}

export async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    const hash = hashRefreshToken(token);
    await RefreshToken.update(
      { revocado_en: new Date() },
      { where: { token_hash: hash, revocado_en: null } }
    );
  }
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  res.status(204).end();
}
//trae los datos del usuario logueado
export async function me(req, res) {
  const usuario = await Usuario.findByPk(req.usuario.sub);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
  res.json({ user: toPublicUser(usuario) });
}
