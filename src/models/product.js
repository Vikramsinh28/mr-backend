import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { isDecimal: true, min: 0 } },
  description: { type: DataTypes.TEXT, allowNull: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, field: 'category_id' },
  createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
  updatedBy: { type: DataTypes.INTEGER, allowNull: true, field: 'updated_by' }
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true,
  underscored: true
});

export default Product;
