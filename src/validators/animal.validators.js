const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ESPECIES_LIBRES = true; // especie es texto libre (Perro, Gato, Otro...)
const TAMANOS_VALIDOS = ["Pequeño", "Mediano", "Grande"];
const SEXOS_VALIDOS = ["Macho", "Hembra"];

// valida los datos del animal antes de guardar
export function validateAnimalBody(req, res, next) {
  const {
    nombre,
    especie,
    raza,
    edad,
    tamano,
    sexo,
    ciudad,
    contacto_email,
    contacto_telefono,
  } = req.body ?? {};

  const errores = {};

  if (!nombre?.trim() || nombre.trim().length > 80) {
    errores.nombre = "El nombre es obligatorio (máx. 80 caracteres).";
  }
  if (!especie?.trim() || especie.trim().length > 40) {
    errores.especie = "La especie es obligatoria (máx. 40 caracteres).";
  }
  if (!raza?.trim() || raza.trim().length > 80) {
    errores.raza = "La raza es obligatoria (máx. 80 caracteres).";
  }
  if (edad === undefined || edad === null || isNaN(Number(edad)) || Number(edad) < 0) {
    errores.edad = "La edad debe ser un número mayor o igual a 0.";
  }
  if (!TAMANOS_VALIDOS.includes(tamano)) {
    errores.tamano = `El tamaño debe ser uno de: ${TAMANOS_VALIDOS.join(", ")}.`;
  }
  if (!SEXOS_VALIDOS.includes(sexo)) {
    errores.sexo = `El sexo debe ser uno de: ${SEXOS_VALIDOS.join(", ")}.`;
  }
  if (!ciudad?.trim() || ciudad.trim().length > 80) {
    errores.ciudad = "La ciudad es obligatoria (máx. 80 caracteres).";
  }
  if (!EMAIL_RE.test(contacto_email ?? "")) {
    errores.contacto_email = "El correo de contacto no tiene un formato válido.";
  }
  if (!contacto_telefono?.trim() || contacto_telefono.trim().length > 30) {
    errores.contacto_telefono = "El teléfono de contacto es obligatorio (máx. 30 caracteres).";
  }

  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ error: "Datos inválidos.", detalles: errores });
  }

  next();
}
