// Express 4 no captura errores de handlers async: sin esto, un throw
// dentro de un controlador async deja la petición colgada en vez de
// caer en el error handler global.
export const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);
