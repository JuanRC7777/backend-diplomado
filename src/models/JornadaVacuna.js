import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// tabla intermedia entre jornada y vacuna
export const JornadaVacuna = sequelize.define(
  "JornadaVacuna",
  {
    jornada_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, primaryKey: true },
    vacuna_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, primaryKey: true },
  },
  {
    tableName: "jornada_vacunas",
    timestamps: false,
  }
);
