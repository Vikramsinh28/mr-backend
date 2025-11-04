import {
  sequelize
} from '../config/database.js';

// Import all models
import User from './user.js';
import Role from './role.js';
import Permission from './permission.js';
import UserRole from './userRole.js';
import RolePermission from './rolePermission.js';
import Company from './company.js';
import Department from './department.js';
import UserDepartment from './userDepartment.js';

// Define associations

// Company ↔ User (One-to-Many)
Company.hasMany(User, {
  foreignKey: 'company_id'
});
User.belongsTo(Company, {
  foreignKey: 'company_id'
});

// Company ↔ Role (One-to-Many)
Company.hasMany(Role, {
  foreignKey: 'company_id'
});
Role.belongsTo(Company, {
  foreignKey: 'company_id'
});

// Company ↔ Permission (One-to-Many)
Company.hasMany(Permission, {
  foreignKey: 'company_id'
});
Permission.belongsTo(Company, {
  foreignKey: 'company_id'
});

// Company ↔ Department (One-to-Many)
Company.hasMany(Department, {
  foreignKey: 'companyId',
  as: 'departments'
});
Department.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company'
});

// User ↔ Role (Many-to-Many via UserRole)
User.belongsToMany(Role, {
  through: {
    model: UserRole,
    unique: false
  },
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles'
});

Role.belongsToMany(User, {
  through: {
    model: UserRole,
    unique: false
  },
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users'
});

// Role ↔ Permission (Many-to-Many via RolePermission)
Role.belongsToMany(Permission, {
  through: {
    model: RolePermission,
    unique: false
  },
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions'
});

Permission.belongsToMany(Role, {
  through: {
    model: RolePermission,
    unique: false
  },
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles'
});

// Join table relationships (optional, for direct access)
UserRole.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserRole.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role'
});

RolePermission.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role'
});

RolePermission.belongsTo(Permission, {
  foreignKey: 'permissionId',
  as: 'permission'
});

// User ↔ Department (Many-to-Many via UserDepartment)
User.belongsToMany(Department, {
  through: {
    model: UserDepartment,
    unique: false
  },
  foreignKey: 'userId',
  otherKey: 'departmentId',
  as: 'departments'
});

Department.belongsToMany(User, {
  through: {
    model: UserDepartment,
    unique: false
  },
  foreignKey: 'departmentId',
  otherKey: 'userId',
  as: 'users'
});

// Join table relationships for UserDepartment
UserDepartment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserDepartment.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
});

// Export all models and sequelize instance
export {
  sequelize,
  Company,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Department,
  UserDepartment
};

// Export default object with all models
export default {
  sequelize,
  Company,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Department,
  UserDepartment
};