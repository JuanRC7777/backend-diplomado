import { AppError } from "../utils/AppError.js";

// necesita que ya haya corrido requireAuth antes
export const requireOwner = (Modelo, nombreRecurso = "Recurso") => async (req, res, next) => {
  const registro = await Modelo.findByPk(req.params.id);
  if (!registro) {
    return next(new AppError(404, `${nombreRecurso} no encontrado.`));
  }

  const esDueno = registro.usuario_id === req.usuario.sub;
  const esAdmin = req.usuario.rol === "admin";
  
  if (!esDueno && !esAdmin) {
    return next(new AppError(403, "No tienes permiso para modificar este recurso."));
  }

  req.recurso = registro;
  next();
};
