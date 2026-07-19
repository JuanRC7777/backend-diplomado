import { Vacuna } from "../models/index.js";

// devuelve el catagolo de vacunas ordenado
export async function index(req, res) {
  const vacunas = await Vacuna.findAll({ order: [["nombre", "ASC"]] });
  res.json(vacunas);

}
