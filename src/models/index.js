import { sequelize } from "../config/database.js";

// Import all models
import User from "./user.js";
import Expense from "./expense.js";
import Doctor from "./doctor.js";
import Category from "./category.js";
import Product from "./product.js";
import DoctorProdct from "./doctorProdct.js";
import CompleteVisit from "./completeVisit.js";
import VisitPlanning from "./visitPlanning.js";

Expense.belongsTo(User, {
  foreignKey: "createdBy",
  targetKey: "id",
  as: "creator",
});
Expense.belongsTo(User, {
  foreignKey: "updatedBy",
  targetKey: "id",
  as: "updater",
});
Expense.belongsTo(User, {
  foreignKey: "approvedBy",
  targetKey: "id",
  as: "approver",
});
User.hasMany(Expense, {
  foreignKey: "createdBy",
  sourceKey: "id",
  as: "createdExpenses",
});
User.hasMany(Expense, {
  foreignKey: "updatedBy",
  sourceKey: "id",
  as: "updatedExpenses",
});
User.hasMany(Expense, {
  foreignKey: "approvedBy",
  sourceKey: "id",
  as: "approvedExpenses",
});

// Doctor associations (user scoped via created_by/updated_by)
Doctor.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Doctor.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });
User.hasMany(Doctor, { foreignKey: "createdBy", as: "createdDoctors" });
User.hasMany(Doctor, { foreignKey: "updatedBy", as: "updatedDoctors" });

// Category/Product associations
Category.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Category.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });
User.hasMany(Category, { foreignKey: "createdBy", as: "createdCategories" });
User.hasMany(Category, { foreignKey: "updatedBy", as: "updatedCategories" });

Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Product.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });
User.hasMany(Product, { foreignKey: "createdBy", as: "createdProducts" });
User.hasMany(Product, { foreignKey: "updatedBy", as: "updatedProducts" });

// Doctor-Product assignment
DoctorProdct.belongsTo(Product, { foreignKey: "pId", as: "product" });
DoctorProdct.belongsTo(Doctor, { foreignKey: "drId", as: "doctor" });
DoctorProdct.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
DoctorProdct.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });
Product.hasMany(DoctorProdct, { foreignKey: "pId", as: "doctorAssignments" });
Doctor.hasMany(DoctorProdct, { foreignKey: "drId", as: "productAssignments" });
User.hasMany(DoctorProdct, {
  foreignKey: "createdBy",
  as: "createdDoctorProdcts",
});
User.hasMany(DoctorProdct, {
  foreignKey: "updatedBy",
  as: "updatedDoctorProdcts",
});

// Export all models and sequelize instance
export {
  sequelize,
  User,
  Expense,
  Doctor,
  Category,
  Product,
  DoctorProdct,
  VisitPlanning,
  CompleteVisit,
};

// Export default object with all models
export default {
  sequelize,
  User,
  Expense,
  Doctor,
  Category,
  Product,
  DoctorProdct,
  VisitPlanning,
  CompleteVisit,
};
