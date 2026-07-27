import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const SolicitudAdopcion = sequelize.define(
  "SolicitudAdopcion",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    animal_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    nombre_solicitante: { type: DataTypes.STRING(120), allowNull: false },
    telefono_solicitante: { type: DataTypes.STRING(30), allowNull: false },
    email_solicitante: { type: DataTypes.STRING(190), allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: true },
    fecha_solicitud: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "solicitudes_adopcion",
    timestamps: false,
  }
);
