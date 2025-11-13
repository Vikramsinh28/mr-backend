import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const CompleteVisit = sequelize.define('CompleteVisit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  drId: { type: DataTypes.INTEGER, allowNull: false, field: 'dr_id' },
  visitPlanningId: { type: DataTypes.INTEGER, allowNull: false, field: 'visit_planning_id' },
  createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
  updatedBy: { type: DataTypes.INTEGER, allowNull: true, field: 'updated_by' },
  visitedBy: { type: DataTypes.INTEGER, allowNull: true, field: 'visited_by' }
}, {
  tableName: 'complete_visit',
  timestamps: true,
  paranoid: true,
  underscored: true
});

export default CompleteVisit;
