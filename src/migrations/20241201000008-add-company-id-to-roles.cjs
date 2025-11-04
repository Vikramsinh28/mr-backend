'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roles', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add index for better query performance
    await queryInterface.addIndex('roles', ['company_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('roles', ['company_id']);
    await queryInterface.removeColumn('roles', 'company_id');
  }
};

