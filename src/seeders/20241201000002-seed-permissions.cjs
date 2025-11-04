'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const allPermissions = [
            // User permissions
            {
                name: 'user.view',
                description: 'View users',
                resource: 'user',
                action: 'view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'user.create',
                description: 'Create new users',
                resource: 'user',
                action: 'create',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'user.edit',
                description: 'Edit existing users',
                resource: 'user',
                action: 'edit',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'user.delete',
                description: 'Delete users',
                resource: 'user',
                action: 'delete',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Role permissions
            {
                name: 'role.view',
                description: 'View roles',
                resource: 'role',
                action: 'view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'role.create',
                description: 'Create new roles',
                resource: 'role',
                action: 'create',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'role.edit',
                description: 'Edit existing roles',
                resource: 'role',
                action: 'edit',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'role.delete',
                description: 'Delete roles',
                resource: 'role',
                action: 'delete',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Permission management
            {
                name: 'permission.view',
                description: 'View permissions',
                resource: 'permission',
                action: 'view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'permission.assign',
                description: 'Assign permissions to roles',
                resource: 'permission',
                action: 'assign',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Company permissions
            {
                name: 'company.view',
                description: 'View company information',
                resource: 'company',
                action: 'view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'company.create',
                description: 'Create new companies',
                resource: 'company',
                action: 'create',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'company.edit',
                description: 'Edit company information and update company profile',
                resource: 'company',
                action: 'edit',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'company.delete',
                description: 'Delete companies',
                resource: 'company',
                action: 'delete',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            // Department permissions
            {
                name: 'department.view',
                description: 'View departments',
                resource: 'department',
                action: 'view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'department.create',
                description: 'Create new departments',
                resource: 'department',
                action: 'create',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'department.edit',
                description: 'Edit departments and assign users',
                resource: 'department',
                action: 'edit',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'department.delete',
                description: 'Delete departments',
                resource: 'department',
                action: 'delete',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Check if permissions already exist
        const existingPermissions = await queryInterface.sequelize.query(
            "SELECT name FROM permissions", {
                type: Sequelize.QueryTypes.SELECT
            }
        );

        const existingPermissionNames = existingPermissions.map(perm => perm.name);
        const permissionsToInsert = allPermissions.filter(
            perm => !existingPermissionNames.includes(perm.name)
        );

        if (permissionsToInsert.length > 0) {
            await queryInterface.bulkInsert('permissions', permissionsToInsert, {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('permissions', {
            name: {
                [Sequelize.Op.in]: [
                    'user.view', 'user.create', 'user.edit', 'user.delete',
                    'role.view', 'role.create', 'role.edit', 'role.delete',
                    'permission.view', 'permission.assign',
                    'company.view', 'company.create', 'company.edit', 'company.delete',
                    'department.view', 'department.create', 'department.edit', 'department.delete'
                ]
            }
        }, {});
    }
};