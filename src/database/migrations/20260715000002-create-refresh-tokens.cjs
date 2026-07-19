module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("refresh_tokens", {
      id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      usuario_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
      },
      token_hash: { type: Sequelize.CHAR(64), allowNull: false, unique: true },
      user_agent: { type: Sequelize.STRING(255), allowNull: true },
      ip_address: { type: Sequelize.STRING(45), allowNull: true },
      expira_en: { type: Sequelize.DATE, allowNull: false },
      revocado_en: { type: Sequelize.DATE, allowNull: true },
      creado_en: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });
    await queryInterface.addIndex("refresh_tokens", ["usuario_id"], { name: "idx_refresh_usuario" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("refresh_tokens");
  },
};
