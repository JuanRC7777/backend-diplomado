module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("vacunas", [
      { nombre: "Antirrábica" },
      { nombre: "Parvovirus" },
      { nombre: "Moquillo" },
      { nombre: "Triple Felina" },
      { nombre: "Leucemia Felina" },
      { nombre: "Bordetella" },
      { nombre: "Rabia" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("vacunas", null);
  },
};
