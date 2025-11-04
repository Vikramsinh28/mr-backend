'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('permissions', 'company_id', {
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
    await queryInterface.addIndex('permissions', ['company_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('permissions', ['company_id']);
    await queryInterface.removeColumn('permissions', 'company_id');
  }
};

