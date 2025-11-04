'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('companies', 'gst_number', {
            type: Sequelize.STRING(15),
            allowNull: true,
            comment: 'GST (Goods and Services Tax) number'
        });

        await queryInterface.addColumn('companies', 'pan_number', {
            type: Sequelize.STRING(10),
            allowNull: true,
            comment: 'PAN (Permanent Account Number)'
        });

        await queryInterface.addColumn('companies', 'registration_number', {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: 'Company registration number'
        });

        await queryInterface.addColumn('companies', 'website', {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'Company website URL'
        });

        await queryInterface.addColumn('companies', 'city', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'City'
        });

        await queryInterface.addColumn('companies', 'state', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'State or Province'
        });

        await queryInterface.addColumn('companies', 'country', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Country'
        });

        await queryInterface.addColumn('companies', 'postal_code', {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: 'Postal or ZIP code'
        });

        await queryInterface.addColumn('companies', 'contact_person', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Primary contact person name'
        });

        await queryInterface.addColumn('companies', 'contact_phone', {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: 'Contact person phone number'
        });

        await queryInterface.addColumn('companies', 'fax', {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: 'Fax number'
        });

        await queryInterface.addColumn('companies', 'industry', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Industry type'
        });

        await queryInterface.addColumn('companies', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Company description'
        });

        // Add unique indexes for GST and PAN
        // Note: Most databases allow multiple NULL values in unique indexes
        // The model validation will also enforce uniqueness at the application level
        await queryInterface.addIndex('companies', ['gst_number'], {
            unique: true,
            name: 'companies_gst_number_unique'
        });

        await queryInterface.addIndex('companies', ['pan_number'], {
            unique: true,
            name: 'companies_pan_number_unique'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('companies', 'companies_pan_number_unique');
        await queryInterface.removeIndex('companies', 'companies_gst_number_unique');

        await queryInterface.removeColumn('companies', 'description');
        await queryInterface.removeColumn('companies', 'industry');
        await queryInterface.removeColumn('companies', 'fax');
        await queryInterface.removeColumn('companies', 'contact_phone');
        await queryInterface.removeColumn('companies', 'contact_person');
        await queryInterface.removeColumn('companies', 'postal_code');
        await queryInterface.removeColumn('companies', 'country');
        await queryInterface.removeColumn('companies', 'state');
        await queryInterface.removeColumn('companies', 'city');
        await queryInterface.removeColumn('companies', 'website');
        await queryInterface.removeColumn('companies', 'registration_number');
        await queryInterface.removeColumn('companies', 'pan_number');
        await queryInterface.removeColumn('companies', 'gst_number');
    }
};