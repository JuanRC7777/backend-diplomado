module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jornada_vacunas", {
      jornada_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: { model: "jornadas", key: "id" },
        onDelete: "CASCADE",
      },
      vacuna_id: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: { model: "vacunas", key: "id" },
        onDelete: "RESTRICT",
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("jornada_vacunas");
  },
};
