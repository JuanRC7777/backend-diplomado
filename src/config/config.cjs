require("dotenv").config({ path: require("path").resolve(__dirname, "..", "..", ".env") });

// datos de conexion
const base = {
  username: process.env.DB_ADMIN_USER,
  password: process.env.DB_ADMIN_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  dialect: "mysql",
  dialectOptions:
    process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : undefined,
};

// exportacion
module.exports = {
  development: base,
  test: base,
  production: base,
};
