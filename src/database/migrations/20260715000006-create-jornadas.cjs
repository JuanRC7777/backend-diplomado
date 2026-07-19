module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jornadas", {
      id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      usuario_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: { model: "usuarios", key: "id" },
        onDelete: "SET NULL",
      },
      titulo: { type: Sequelize.STRING(150), allowNull: false },
      lugar: { type: Sequelize.STRING(150), allowNull: false },
      ciudad: { type: Sequelize.STRING(80), allowNull: false },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      hora_inicio: { type: Sequelize.TIME, allowNull: false },
      hora_fin: { type: Sequelize.TIME, allowNull: false },
      organizador: { type: Sequelize.STRING(120), allowNull: false },
      contacto_email: { type: Sequelize.STRING(190), allowNull: false },
      cupos: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      fecha_publicacion: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.literal("(CURRENT_DATE)") },
    });
    await queryInterface.addIndex("jornadas", ["ciudad", "fecha"], { name: "idx_jornadas_ciudad_fecha" });
    await queryInterface.addIndex("jornadas", ["usuario_id"], { name: "idx_jornadas_usuario" });
    await queryInterface.sequelize.query(
      "ALTER TABLE jornadas ADD CONSTRAINT chk_jornadas_horario CHECK (hora_fin > hora_inicio)"
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("jornadas");
  },
};
