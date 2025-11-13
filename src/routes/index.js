import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import roleRoutes from './roleRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import companyRoutes from './companyRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import doctorProdctRoutes from './doctorProdctRoutes.js';
import visitRoutes from './visitRoutes.js';

const router = express.Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/companies', companyRoutes);
router.use('/departments', departmentRoutes);
router.use('/expenses', expenseRoutes);
router.use('/doctors', doctorRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/doctor-products', doctorProdctRoutes);
router.use('/visits', visitRoutes);

export default router;

