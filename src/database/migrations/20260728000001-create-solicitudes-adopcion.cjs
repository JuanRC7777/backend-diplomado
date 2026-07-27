module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("solicitudes_adopcion", {
      id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      animal_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "animales", key: "id" },
        onDelete: "CASCADE",
      },
      nombre_solicitante: { type: Sequelize.STRING(120), allowNull: false },
      telefono_solicitante: { type: Sequelize.STRING(30), allowNull: false },
      email_solicitante: { type: Sequelize.STRING(190), allowNull: false },
      mensaje: { type: Sequelize.TEXT, allowNull: true },
      fecha_solicitud: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex("solicitudes_adopcion", ["animal_id"], { name: "idx_solicitudes_animal" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("solicitudes_adopcion");
  },
};
