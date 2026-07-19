module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios", {
      id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(190), allowNull: false, unique: true },
      telefono: { type: Sequelize.STRING(30), allowNull: true },
      password_hash: { type: Sequelize.CHAR(60), allowNull: false },
      rol: { type: Sequelize.ENUM("usuario", "admin"), allowNull: false, defaultValue: "usuario" },
      activo: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      creado_en: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      actualizado_en: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("usuarios");
  },
};
