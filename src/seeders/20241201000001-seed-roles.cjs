'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if roles already exist
        const existingRoles = await queryInterface.sequelize.query(
            "SELECT name FROM roles WHERE name IN ('admin', 'editor', 'viewer')",
            { type: Sequelize.QueryTypes.SELECT }
        );

        const existingRoleNames = existingRoles.map(role => role.name);
        const rolesToInsert = [];

        if (!existingRoleNames.includes('admin')) {
            rolesToInsert.push({
                name: 'admin',
                description: 'Full system access with all permissions',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (!existingRoleNames.includes('editor')) {
            rolesToInsert.push({
                name: 'editor',
                description: 'Can create, read, and update content but cannot delete or manage users',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (!existingRoleNames.includes('viewer')) {
            rolesToInsert.push({
                name: 'viewer',
                description: 'Read-only access to view content',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        if (rolesToInsert.length > 0) {
            await queryInterface.bulkInsert('roles', rolesToInsert, {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('roles', {
            name: {
                [Sequelize.Op.in]: ['admin', 'editor', 'viewer']
            }
        }, {});
    }
};

