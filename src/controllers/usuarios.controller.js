import { Usuario } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// lista de usuarios para el panel de administracion (sin password_hash)
export async function index(_req, res) {
  const usuarios = await Usuario.findAll({
    attributes: ["id", "nombre", "email", "telefono", "rol", "activo", "creado_en"],
    order: [["creado_en", "DESC"]],
  });
  res.json(usuarios);
}

// activar/desactivar una cuenta
export async function actualizarEstado(req, res) {
  const { activo } = req.body ?? {};
  if (typeof activo !== "boolean") {
    throw new AppError(400, "El campo 'activo' debe ser booleano.");
  }

  if (Number(req.params.id) === req.usuario.sub) {
    throw new AppError(400, "No puedes cambiar el estado de tu propia cuenta.");
  }

  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) throw new AppError(404, "Usuario no encontrado.");

  usuario.activo = activo;
  await usuario.save();
  res.json({ id: usuario.id, activo: usuario.activo });
}
