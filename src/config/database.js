import { Sequelize } from "sequelize";

// SSl si toca como dijo el dicho Juan
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    dialect: "mysql",
    dialectOptions: {
      // Charset explicito para la conexion, en vez de depender del default
      // del servidor -- las tablas ya son utf8mb4, esto lo deja consistente.
      charset: "utf8mb4",
      ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    logging: false,
  }
);
