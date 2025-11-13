import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const VisitPlanning = sequelize.define('VisitPlanning', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  city: { type: DataTypes.STRING, allowNull: false },
  purposeOfVisit: { type: DataTypes.STRING, allowNull: true, field: 'purpose_of_visit' },
  notes: { type: DataTypes.TEXT, allowNull: true },
  visitDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'visit_date' },
  createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
  updatedBy: { type: DataTypes.INTEGER, allowNull: true, field: 'updated_by' }
}, {
  tableName: 'visit_planning',
  timestamps: true,
  paranoid: true,
  underscored: true
});

export default VisitPlanning;
