import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resource: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Optional resource type (e.g., "user", "post", "order")'
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Optional action type (e.g., "create", "read", "update", "delete")'
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
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
  tableName: 'permissions',
  timestamps: true,
  underscored: false
});

export default Permission;

