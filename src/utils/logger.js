// Logger simple sin dependencias externas. Cada linea lleva timestamp ISO,
// nivel y mensaje, y opcionalmente un objeto de contexto (se imprime como
// JSON al final de la linea).
function formatear(nivel, mensaje, contexto) {
  const timestamp = new Date().toISOString();
  const sufijo = contexto ? ` ${JSON.stringify(contexto)}` : "";
  return `[${timestamp}] [${nivel}] ${mensaje}${sufijo}`;
}

export function logInfo(mensaje, contexto) {
  console.log(formatear("INFO", mensaje, contexto));
}

export function logWarn(mensaje, contexto) {
  console.warn(formatear("WARN", mensaje, contexto));
}

export function logError(mensaje, contexto) {
  console.error(formatear("ERROR", mensaje, contexto));
}
