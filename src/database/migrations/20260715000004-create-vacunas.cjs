module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vacunas", {
      id: { type: Sequelize.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING(60), allowNull: false, unique: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("vacunas");
  },
};
