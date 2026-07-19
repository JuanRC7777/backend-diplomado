module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("login_attempts", {
      id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: Sequelize.STRING(190), allowNull: false },
      ip_address: { type: Sequelize.STRING(45), allowNull: false },
      exitoso: { type: Sequelize.TINYINT, allowNull: false },
      creado_en: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });
    await queryInterface.addIndex("login_attempts", ["email", "creado_en"], {
      name: "idx_login_email_fecha",
    });
    await queryInterface.addIndex("login_attempts", ["ip_address", "creado_en"], {
      name: "idx_login_ip_fecha",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("login_attempts");
  },
};
