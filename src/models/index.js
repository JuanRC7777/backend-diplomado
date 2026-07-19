import { sequelize } from "../config/database.js";
import { Usuario } from "./Usuario.js";
import { RefreshToken } from "./RefreshToken.js";
import { LoginAttempt } from "./LoginAttempt.js";
import { Vacuna } from "./Vacuna.js";
import { Animal } from "./Animal.js";
import { Jornada } from "./Jornada.js";
import { JornadaVacuna } from "./JornadaVacuna.js";

// para mayor clarides

// usuario <-> RefreshToken (1:N)
Usuario.hasMany(RefreshToken, { foreignKey: "usuario_id" });
RefreshToken.belongsTo(Usuario, { foreignKey: "usuario_id" });

// usuario <-> Animal (1:N, el animal puede quedar sin dueño)
Usuario.hasMany(Animal, { foreignKey: "usuario_id" });
Animal.belongsTo(Usuario, { foreignKey: "usuario_id" });

// usuario <-> Jornada (1:N)
Usuario.hasMany(Jornada, { foreignKey: "usuario_id" });
Jornada.belongsTo(Usuario, { foreignKey: "usuario_id" });

// Jornada <> Vacuna (N:M a través de JornadaVacuna)
Jornada.belongsToMany(Vacuna, {
  through: JornadaVacuna,
  foreignKey: "jornada_id",
  otherKey: "vacuna_id",
});
Vacuna.belongsToMany(Jornada, {
  through: JornadaVacuna,
  foreignKey: "vacuna_id",
  otherKey: "jornada_id",
});

export { sequelize, Usuario, RefreshToken, LoginAttempt, Vacuna, Animal, Jornada, JornadaVacuna };
