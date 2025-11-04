'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_departments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            department_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'departments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            assigned_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add unique constraint and indexes
        await queryInterface.addIndex('user_departments', ['user_id', 'department_id'], {
            unique: true,
            name: 'user_departments_user_id_department_id_unique'
        });
        await queryInterface.addIndex('user_departments', ['user_id']);
        await queryInterface.addIndex('user_departments', ['department_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_departments');
    }
};

