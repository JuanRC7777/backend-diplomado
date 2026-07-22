import { Vacuna } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// devuelve el catagolo de vacunas ordenado
export async function index(req, res) {
  const vacunas = await Vacuna.findAll({ order: [["nombre", "ASC"]] });
  res.json(vacunas);

}

// agrega una vacuna al catalogo (solo admin)
export async function create(req, res) {
  const { nombre } = req.body ?? {};
  if (!nombre?.trim()) throw new AppError(400, "El nombre de la vacuna es obligatorio.");

  const existente = await Vacuna.findOne({ where: { nombre: nombre.trim() } });
  if (existente) throw new AppError(409, "Esa vacuna ya existe en el catalogo.");

  const vacuna = await Vacuna.create({ nombre: nombre.trim() });
  res.status(201).json(vacuna);
}

// quita una vacuna del catalogo (solo admin)
export async function remove(req, res) {
  const vacuna = await Vacuna.findByPk(req.params.id);
  if (!vacuna) throw new AppError(404, "Vacuna no encontrada.");

  await vacuna.destroy();
  res.status(204).end();
}
