const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const password_hash = await bcrypt.hash("admin123", 12);
    await queryInterface.bulkInsert("usuarios", [
      {
        nombre: "Administrador PawCare",
        email: "admin@pawcare.co",
        telefono: null,
        password_hash,
        rol: "admin",
        activo: true,
        creado_en: new Date(),
        actualizado_en: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("usuarios", { email: "admin@pawcare.co" });
  },
};
