import {
    DataTypes
} from 'sequelize';
import {
    sequelize
} from '../config/database.js';

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    domain: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isUrl: false, // Just a domain string, not full URL
            len: [3, 100]
        }
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'postal_code'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: true
        // URL validation is handled in middleware
    },
    gstNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
        field: 'gst_number',
        validate: {
            len: [15, 15]
        }
    },
    panNumber: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
        field: 'pan_number',
        validate: {
            len: [10, 10],
            is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
        }
    },
    registrationNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'registration_number'
    },
    contactPerson: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'contact_person'
    },
    contactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'contact_phone'
    },
    fax: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    industry: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active' // Maps to is_active column in database
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'companies',
    timestamps: true,
    underscored: false
});

export default Company;