module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("animales", {
      id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      usuario_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: { model: "usuarios", key: "id" },
        onDelete: "SET NULL",
      },
      nombre: { type: Sequelize.STRING(80), allowNull: false },
      especie: { type: Sequelize.STRING(40), allowNull: false },
      raza: { type: Sequelize.STRING(80), allowNull: false },
      edad: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false },
      unidad_edad: { type: Sequelize.ENUM("meses", "años"), allowNull: false, defaultValue: "años" },
      tamano: { type: Sequelize.ENUM("Pequeño", "Mediano", "Grande"), allowNull: false },
      sexo: { type: Sequelize.ENUM("Macho", "Hembra"), allowNull: false },
      estado_salud: { type: Sequelize.STRING(60), allowNull: false, defaultValue: "Buena" },
      vacunado: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 },
      esterilizado: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      foto_url: { type: Sequelize.STRING(500), allowNull: true },
      ciudad: { type: Sequelize.STRING(80), allowNull: false },
      contacto_email: { type: Sequelize.STRING(190), allowNull: false },
      contacto_telefono: { type: Sequelize.STRING(30), allowNull: false },
      carnet: { type: Sequelize.STRING(40), allowNull: true },
      fecha_publicacion: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.literal("(CURRENT_DATE)") },
    });
    await queryInterface.addIndex("animales", ["ciudad"], { name: "idx_animales_ciudad" });
    await queryInterface.addIndex("animales", ["usuario_id"], { name: "idx_animales_usuario" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("animales");
  },
};
