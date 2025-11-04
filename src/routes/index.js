import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import roleRoutes from './roleRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import companyRoutes from './companyRoutes.js';
import departmentRoutes from './departmentRoutes.js';

const router = express.Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/companies', companyRoutes);
router.use('/departments', departmentRoutes);

export default router;

