import { Animal, SolicitudAdopcion } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { logInfo } from "../utils/logger.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// registra una solicitud de adopcion (publico, no requiere sesion)
export async function create(req, res) {
  const { animal_id, nombre_solicitante, telefono_solicitante, email_solicitante, mensaje } = req.body ?? {};

  const errores = {};
  if (!animal_id || isNaN(Number(animal_id))) errores.animal_id = "El animal es requerido.";
  if (!nombre_solicitante?.trim()) errores.nombre_solicitante = "El nombre es requerido.";
  if (!telefono_solicitante?.trim()) errores.telefono_solicitante = "El teléfono es requerido.";
  if (!EMAIL_RE.test(email_solicitante ?? "")) errores.email_solicitante = "El correo no es válido.";

  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ error: "Datos inválidos.", detalles: errores });
  }

  const animal = await Animal.findByPk(animal_id);
  if (!animal) throw new AppError(404, "Animal no encontrado.");

  const solicitud = await SolicitudAdopcion.create({
    animal_id: animal.id,
    nombre_solicitante: nombre_solicitante.trim(),
    telefono_solicitante: telefono_solicitante.trim(),
    email_solicitante: email_solicitante.trim(),
    mensaje: mensaje?.trim() || null,
  });

  logInfo("Solicitud de adopcion creada", { solicitudId: solicitud.id, animalId: animal.id });
  res.status(201).json(solicitud);
}

// lista las solicitudes con el animal asociado (solo admin)
export async function index(_req, res) {
  const solicitudes = await SolicitudAdopcion.findAll({
    include: [{ model: Animal, attributes: ["id", "nombre", "foto_url"] }],
    order: [["fecha_solicitud", "DESC"]],
  });
  res.json(solicitudes);
}
