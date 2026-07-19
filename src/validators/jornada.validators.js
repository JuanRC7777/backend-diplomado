const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateJornadaBody(req, res, next) {
  const {
    titulo,
    lugar,
    ciudad,
    fecha,
    hora_inicio,
    hora_fin,
    organizador,
    contacto_email,
    cupos,
    vacunas,
  } = req.body ?? {};

  const errores = {};

  if (!titulo?.trim() || titulo.trim().length > 150) {
    errores.titulo = "El título es obligatorio (máx. 150 caracteres).";
  }
  if (!lugar?.trim() || lugar.trim().length > 150) {
    errores.lugar = "El lugar es obligatorio (máx. 150 caracteres).";
  }
  if (!ciudad?.trim() || ciudad.trim().length > 80) {
    errores.ciudad = "La ciudad es obligatoria (máx. 80 caracteres).";
  }
  if (!fecha || isNaN(Date.parse(fecha))) {
    errores.fecha = "La fecha es obligatoria y debe ser válida.";
  }
  // validaciones de horario
  if (!hora_inicio) errores.hora_inicio = "La hora de inicio es obligatoria.";
  if (!hora_fin) errores.hora_fin = "La hora de fin es obligatoria.";
  if (hora_inicio && hora_fin && hora_fin <= hora_inicio) {
    errores.hora_fin = "La hora de fin debe ser posterior a la hora de inicio.";
  }
  if (!organizador?.trim() || organizador.trim().length > 120) {
    errores.organizador = "El organizador es obligatorio (máx. 120 caracteres).";
  }
  if (!EMAIL_RE.test(contacto_email ?? "")) {
    errores.contacto_email = "El correo de contacto no tiene un formato válido.";
  }
  if (cupos === undefined || cupos === null || isNaN(Number(cupos)) || Number(cupos) <= 0) {
    errores.cupos = "Los cupos deben ser un número mayor a 0.";
  }
  if (!Array.isArray(vacunas) || vacunas.length === 0) {
    errores.vacunas = "Selecciona al menos una vacuna (por id del catálogo).";
  }

  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ error: "Datos inválidos.", detalles: errores });
  }

  next();
}
