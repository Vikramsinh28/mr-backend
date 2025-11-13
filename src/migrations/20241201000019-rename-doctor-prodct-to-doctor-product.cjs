'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename table doctor_prodct -> doctor_product
    await queryInterface.renameTable('doctor_prodct', 'doctor_product');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert table name doctor_product -> doctor_prodct
    await queryInterface.renameTable('doctor_product', 'doctor_prodct');
  }
};
