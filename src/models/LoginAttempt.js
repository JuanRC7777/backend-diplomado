import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// guarda los intentos de login, para el tema de bloqueo
export const LoginAttempt = sequelize.define(
  "LoginAttempt",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(190), allowNull: false },
    ip_address: { type: DataTypes.STRING(45), allowNull: false },
    exitoso: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    tableName: "login_attempts",
    createdAt: "creado_en",
    updatedAt: false,
  }
);
