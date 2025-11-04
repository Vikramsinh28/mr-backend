'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'company_id', {
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
        await queryInterface.addIndex('users', ['company_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('users', ['company_id']);
        await queryInterface.removeColumn('users', 'company_id');
    }
};