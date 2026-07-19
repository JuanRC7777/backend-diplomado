import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// este es el primero
export const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
    password_hash: { type: DataTypes.CHAR(60), allowNull: false },
    rol: { type: DataTypes.ENUM("usuario", "admin"), allowNull: false, defaultValue: "usuario" },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "usuarios",
    createdAt: "creado_en",
    updatedAt: "actualizado_en",
  }
);
