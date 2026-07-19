import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Animal = sequelize.define(
  "Animal",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    nombre: { type: DataTypes.STRING(80), allowNull: false },
    especie: { type: DataTypes.STRING(40), allowNull: false },
    raza: { type: DataTypes.STRING(80), allowNull: false },
    edad: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    unidad_edad: { type: DataTypes.ENUM("meses", "años"), allowNull: false, defaultValue: "años" },
    tamano: { type: DataTypes.ENUM("Pequeño", "Mediano", "Grande"), allowNull: false },
    sexo: { type: DataTypes.ENUM("Macho", "Hembra"), allowNull: false },
    // datos de salud
    estado_salud: { type: DataTypes.STRING(60), allowNull: false, defaultValue: "Buena" },
    vacunado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    esterilizado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    foto_url: { type: DataTypes.STRING(500), allowNull: true },
    // contacto
    ciudad: { type: DataTypes.STRING(80), allowNull: false },
    contacto_email: { type: DataTypes.STRING(190), allowNull: false },
    contacto_telefono: { type: DataTypes.STRING(30), allowNull: false },
    carnet: { type: DataTypes.STRING(40), allowNull: true },
    fecha_publicacion: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "animales",
    timestamps: false,
  }
);
