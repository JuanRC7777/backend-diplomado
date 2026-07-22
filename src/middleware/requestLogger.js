import { logInfo, logWarn } from "../utils/logger.js";

// Loguea cada request entrante: metodo, ruta, status, duracion y usuario
// (si esta autenticado). req.usuario lo pone requireAuth, pero corre despues
// de este middleware, por eso se lee en el evento "finish" de la respuesta
// (para ese momento requireAuth ya paso, si la ruta lo usa).
export function requestLogger(req, res, next) {
  const inicio = Date.now();

  res.on("finish", () => {
    const duracionMs = Date.now() - inicio;
    const contexto = {
      status: res.statusCode,
      duracionMs,
      ...(req.usuario ? { usuarioId: req.usuario.sub } : {}),
    };
    const mensaje = `${req.method} ${req.originalUrl}`;

    if (res.statusCode >= 400) {
      logWarn(mensaje, contexto);
    } else {
      logInfo(mensaje, contexto);
    }
  });

  next();
}
