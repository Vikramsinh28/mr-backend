import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UserDepartment = sequelize.define('UserDepartment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'department_id',
        references: {
            model: 'departments',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'assigned_at'
    }
}, {
    tableName: 'user_departments',
    timestamps: false,
    underscored: false,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'departmentId']
        }
    ]
});

export default UserDepartment;

