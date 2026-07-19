import { Op } from "sequelize";
import { Animal } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

// trae los animles, se puede filtrar
export async function index(req, res) {
  const { ciudad, especie, q } = req.query;
  const where = {};
  if (ciudad) where.ciudad = ciudad;
  if (especie) where.especie = especie;
  if (q) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${q}%` } },
      { raza: { [Op.like]: `%${q}%` } },
      { ciudad: { [Op.like]: `%${q}%` } },
    ];
  }

  const animales = await Animal.findAll({ where, order: [["fecha_publicacion", "DESC"]] });
  res.json(animales);
}

export async function show(req, res) {
  const animal = await Animal.findByPk(req.params.id);
  if (!animal) throw new AppError(404, "Animal no encontrado.");
  res.json(animal);
}

//pasa los datos del formulario a los tipos correctos
function normalizarBody(body) {
  return {
    ...body,
    edad: Number(body.edad),
    vacunado: body.vacunado=== "true" || body.vacunado === true,
    esterilizado: body.esterilizado === "true" || body.esterilizado === true,
  };
}

export async function create(req, res) {
  const datos = normalizarBody(req.body);
  
  if (req.file) datos.foto_url = `/uploads/${req.file.filename}`;
  
  const animal = await Animal.create({ ...datos, usuario_id: req.usuario.sub });
  res.status(201).json(animal);
}

export async function update(req, res) {
  const datos = normalizarBody(req.body);
  if (req.file) datos.foto_url = `/uploads/${req.file.filename}`;
  await req.recurso.update(datos);
  res.json(req.recurso);
}

export async function remove(req, res) {
  await req.recurso.destroy();
  res.status(204).end();
}
