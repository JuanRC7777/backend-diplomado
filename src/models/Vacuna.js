import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// catalogo de vacunas
export const Vacuna = sequelize.define("Vacuna",
  {
    id: { type: DataTypes.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(60), allowNull: false, unique: true },
  },
  {
    tableName: "vacunas",
    timestamps: false,
  }
);
