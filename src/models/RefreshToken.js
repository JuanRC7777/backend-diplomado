import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    token_hash: { type: DataTypes.CHAR(64), allowNull: false, unique: true },
    user_agent: { type: DataTypes.STRING(255), allowNull: true },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    expira_en: { type: DataTypes.DATE, allowNull: false },
    revocado_en: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "refresh_tokens",
    createdAt: "creado_en",
    //no tiene el update_at
    updatedAt: false,
  }
);
