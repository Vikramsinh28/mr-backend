'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if company already exists
    let insertedCompany = await queryInterface.sequelize.query(
      "SELECT id FROM companies WHERE domain = 'techmeninfotech.com' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    let companyId = insertedCompany[0]?.id;

    if (!companyId) {
      // Insert default company if it doesn't exist
      await queryInterface.bulkInsert(
        'companies',
        [
          {
            name: 'TechMen Infotech',
            domain: 'techmeninfotech.com',
            email: 'info@techmeninfotech.com',
            phone: '+91-9999999999',
            address: 'London, ON / India Office',
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      );

      // Fetch company ID after insertion
      insertedCompany = await queryInterface.sequelize.query(
        "SELECT id FROM companies WHERE domain = 'techmeninfotech.com' LIMIT 1",
        { type: Sequelize.QueryTypes.SELECT }
      );

      companyId = insertedCompany[0]?.id;

      if (!companyId) {
        throw new Error('Failed to retrieve company ID after insertion');
      }
    }

    // Update all existing roles, users, permissions with company_id (only if they don't have one)
    await queryInterface.sequelize.query(
      `UPDATE users SET company_id = ${companyId} WHERE company_id IS NULL`
    );
    await queryInterface.sequelize.query(
      `UPDATE roles SET company_id = ${companyId} WHERE company_id IS NULL`
    );
    await queryInterface.sequelize.query(
      `UPDATE permissions SET company_id = ${companyId} WHERE company_id IS NULL`
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove company_id from all records first
    await queryInterface.sequelize.query(
      `UPDATE users SET company_id = NULL WHERE company_id IS NOT NULL`
    );
    await queryInterface.sequelize.query(
      `UPDATE roles SET company_id = NULL WHERE company_id IS NOT NULL`
    );
    await queryInterface.sequelize.query(
      `UPDATE permissions SET company_id = NULL WHERE company_id IS NOT NULL`
    );

    // Delete the company
    await queryInterface.bulkDelete('companies', {
      domain: 'techmeninfotech.com'
    });
  }
};

