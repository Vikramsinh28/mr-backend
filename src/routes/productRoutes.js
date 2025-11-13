import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateCreateProduct, validateUpdateProduct, validateId, validatePagination } from '../middlewares/validate.js';
import { listProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', authenticate, authorize('product.view'), validatePagination, listProducts);
router.get('/:id', authenticate, authorize('product.view'), validateId, getProductById);
router.post('/', authenticate, authorize('product.create'), validateCreateProduct, createProduct);
router.patch('/:id', authenticate, authorize('product.edit'), validateId, validateUpdateProduct, updateProduct);
router.delete('/:id', authenticate, authorize('product.delete'), validateId, deleteProduct);

export default router;
