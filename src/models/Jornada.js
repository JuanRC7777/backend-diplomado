import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Jornada = sequelize.define(
  "Jornada",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    titulo: { type: DataTypes.STRING(150), allowNull: false },
    lugar: { type: DataTypes.STRING(150), allowNull: false },
    ciudad: { type: DataTypes.STRING(80), allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    hora_inicio: { type: DataTypes.TIME, allowNull: false },
    hora_fin: { type: DataTypes.TIME, allowNull: false },
    organizador: { type: DataTypes.STRING(120), allowNull: false },
    contacto_email: { type: DataTypes.STRING(190), allowNull: false },
    cupos: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    fecha_publicacion: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "jornadas",
    timestamps: false,
    validate: {
      // valida que la hora de fin no sea antes que la de inicio
      horarioValido() {
        if (this.hora_inicio && this.hora_fin && this.hora_fin <= this.hora_inicio) {
          throw new Error("La hora de fin debe ser posterior a la hora de inicio.");
        }
      },
    },
  }
);
