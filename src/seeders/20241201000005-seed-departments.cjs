'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Get the first company (or default company)
        const companies = await queryInterface.sequelize.query(
            "SELECT id FROM companies LIMIT 1",
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (!companies || companies.length === 0) {
            console.log('No companies found. Skipping department seeding.');
            return;
        }

        const companyId = companies[0].id;

        const departments = [
            {
                name: 'Engineering',
                description: 'Handles software development and technical operations',
                company_id: companyId,
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Sales',
                description: 'Sales and client relations',
                company_id: companyId,
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'HR',
                description: 'Human Resources and personnel management',
                company_id: companyId,
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Marketing',
                description: 'Marketing and brand management',
                company_id: companyId,
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Finance',
                description: 'Financial planning and accounting',
                company_id: companyId,
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Check if departments already exist
        const existingDepartments = await queryInterface.sequelize.query(
            "SELECT name FROM departments WHERE company_id = :companyId",
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: { companyId }
            }
        );

        const existingDepartmentNames = existingDepartments.map(dept => dept.name);
        const departmentsToInsert = departments.filter(
            dept => !existingDepartmentNames.includes(dept.name)
        );

        if (departmentsToInsert.length > 0) {
            await queryInterface.bulkInsert('departments', departmentsToInsert, {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('departments', null, {});
    }
};

