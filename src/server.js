import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/auth.routes.js";
import animalesRoutes from "./routes/animales.routes.js";
import jornadasRoutes from "./routes/jornadas.routes.js";
import vacunasRoutes from "./routes/vacunas.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// revisa que esten las variables de entorno necesarias, ojito con esto
const REQUIRED_ENV = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_ACCESS_SECRET"];
const faltantes = REQUIRED_ENV.filter((key) => !process.env[key]);
if (faltantes.length > 0) {
  console.error(`Faltan variables de entorno: ${faltantes.join(", ")}. Revisa backend/.env`);
  process.exit(1);
}

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// para servir las fotos
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/animales", animalesRoutes);
app.use("/api/jornadas", jornadasRoutes);
app.use("/api/vacunas", vacunasRoutes);

app.use((_req, res) => res.status(404).json({ error: "Ruta no encontrada." }));
app.use(errorHandler);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`PawCare API escuchando en http://localhost:${PORT}`);
});
