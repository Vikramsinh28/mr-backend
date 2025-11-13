import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateCreateCategory, validateUpdateCategory, validateId, validatePagination } from '../middlewares/validate.js';
import { listCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', authenticate, authorize('category.view'), validatePagination, listCategories);
router.get('/:id', authenticate, authorize('category.view'), validateId, getCategoryById);
router.post('/', authenticate, authorize('category.create'), validateCreateCategory, createCategory);
router.patch('/:id', authenticate, authorize('category.edit'), validateId, validateUpdateCategory, updateCategory);
router.delete('/:id', authenticate, authorize('category.delete'), validateId, deleteCategory);

export default router;
