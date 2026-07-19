import { Op } from "sequelize";
import { Jornada, Vacuna } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// para traer siempre las vacunas junto con la jornada
const incluirVacunas = { include: [{ model: Vacuna, through: { attributes: [] } }] };

export async function index(req, res) {
  const { ciudad, q } = req.query;
  const where = {};
  if (ciudad) where.ciudad = ciudad;

  if (q) {
    where[Op.or] = [
      { titulo: { [Op.like]: `%${q}%` } },
      { ciudad: { [Op.like]: `%${q}%` } },
      { organizador: { [Op.like]: `%${q}%` } },
    ];
  }

  const jornadas = await Jornada.findAll({ where, order: [["fecha", "ASC"]], ...incluirVacunas });
  res.json(jornadas);
}

export async function show(req, res) {
  const jornada = await Jornada.findByPk(req.params.id, incluirVacunas);
  
  if (!jornada) throw new AppError(404, "Jornada no encontrada.");
  res.json(jornada);
}

export async function create(req, res) {
  const { vacunas, ...datos } = req.body;
  const jornada = await Jornada.create({ ...datos, usuario_id: req.usuario.sub });
  await jornada.setVacunas(vacunas);
  // Volvemos a conulstar para que venga con las vacunas
  const jornadaConVacunas = await Jornada.findByPk(jornada.id, incluirVacunas);
  res.status(201).json(jornadaConVacunas);
}

export async function update(req, res) {
  const { vacunas, ...datos } = req.body;
  await req.recurso.update(datos);
  if (vacunas) await req.recurso.setVacunas(vacunas);
  const jornadaActualizada = await Jornada.findByPk(req.recurso.id, incluirVacunas);
  res.json(jornadaActualizada);
}

export async function remove(req, res) {
  await req.recurso.destroy();
  res.status(204).end();
}
