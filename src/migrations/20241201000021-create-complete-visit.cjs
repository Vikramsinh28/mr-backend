'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('complete_visit', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      dr_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'doctors', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      visit_planning_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'visit_planning', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      created_by: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      updated_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      visited_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { allowNull: true, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('complete_visit', ['dr_id']);
    await queryInterface.addIndex('complete_visit', ['visit_planning_id']);
    await queryInterface.addIndex('complete_visit', ['created_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('complete_visit');
  }
};
