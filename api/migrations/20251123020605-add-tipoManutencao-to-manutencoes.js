'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('manutencoes', 'tipoManutencao', {
      type: Sequelize.STRING,
      allowNull: true, // Ou false se for um campo obrigatório
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('manutencoes', 'tipoManutencao');
  },
};
