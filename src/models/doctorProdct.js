import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const DoctorProdct = sequelize.define('DoctorProdct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pId: { type: DataTypes.INTEGER, allowNull: false, field: 'p_id' },
  drId: { type: DataTypes.INTEGER, allowNull: false, field: 'dr_id' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  productNote: { type: DataTypes.TEXT, allowNull: true, field: 'product_note' },
  createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
  updatedBy: { type: DataTypes.INTEGER, allowNull: true, field: 'updated_by' }
}, {
  tableName: 'doctor_product',
  timestamps: true,
  paranoid: true,
  underscored: true
});

export default DoctorProdct;
