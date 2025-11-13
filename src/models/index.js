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
import Expense from './expense.js';
import Doctor from './doctor.js';
import Category from './category.js';
import Product from './product.js';
import DoctorProdct from './doctorProdct.js';

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

// Expense associations (user-level, not company)
Expense.belongsTo(User, { foreignKey: 'createdBy', targetKey: 'id', as: 'creator' });
Expense.belongsTo(User, { foreignKey: 'updatedBy', targetKey: 'id', as: 'updater' });
Expense.belongsTo(User, { foreignKey: 'approvedBy', targetKey: 'id', as: 'approver' });
User.hasMany(Expense, { foreignKey: 'createdBy', sourceKey: 'id', as: 'createdExpenses' });
User.hasMany(Expense, { foreignKey: 'updatedBy', sourceKey: 'id', as: 'updatedExpenses' });
User.hasMany(Expense, { foreignKey: 'approvedBy', sourceKey: 'id', as: 'approvedExpenses' });

// Doctor associations (user scoped via created_by/updated_by)
Doctor.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Doctor.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });
User.hasMany(Doctor, { foreignKey: 'createdBy', as: 'createdDoctors' });
User.hasMany(Doctor, { foreignKey: 'updatedBy', as: 'updatedDoctors' });

// Category/Product associations
Category.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Category.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });
User.hasMany(Category, { foreignKey: 'createdBy', as: 'createdCategories' });
User.hasMany(Category, { foreignKey: 'updatedBy', as: 'updatedCategories' });

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Product.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });
User.hasMany(Product, { foreignKey: 'createdBy', as: 'createdProducts' });
User.hasMany(Product, { foreignKey: 'updatedBy', as: 'updatedProducts' });

// Doctor-Product assignment
DoctorProdct.belongsTo(Product, { foreignKey: 'pId', as: 'product' });
DoctorProdct.belongsTo(Doctor, { foreignKey: 'drId', as: 'doctor' });
DoctorProdct.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
DoctorProdct.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });
Product.hasMany(DoctorProdct, { foreignKey: 'pId', as: 'doctorAssignments' });
Doctor.hasMany(DoctorProdct, { foreignKey: 'drId', as: 'productAssignments' });
User.hasMany(DoctorProdct, { foreignKey: 'createdBy', as: 'createdDoctorProdcts' });
User.hasMany(DoctorProdct, { foreignKey: 'updatedBy', as: 'updatedDoctorProdcts' });

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
  UserDepartment,
  Expense,
  Doctor,
  Category,
  Product,
  DoctorProdct,
  VisitPlanning,
  CompleteVisit
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
  UserDepartment,
  Expense,
  Doctor,
  Category,
  Product,
  DoctorProdct,
  VisitPlanning,
  CompleteVisit
};