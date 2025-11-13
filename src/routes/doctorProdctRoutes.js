import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateCreateDoctorProdct, validateUpdateDoctorProdct, validateAdjustQuantity, validateId, validatePagination } from '../middlewares/validate.js';
import { listDoctorProdcts, getDoctorProdctById, createDoctorProdct, updateDoctorProdct, deleteDoctorProdct, incrementQuantity, decrementQuantity } from '../controllers/doctorProdctController.js';

const router = express.Router();

router.get('/', authenticate, authorize('doctorProdct.view'), validatePagination, listDoctorProdcts);
router.get('/:id', authenticate, authorize('doctorProdct.view'), validateId, getDoctorProdctById);
router.post('/', authenticate, authorize('doctorProdct.create'), validateCreateDoctorProdct, createDoctorProdct);
router.patch('/:id', authenticate, authorize('doctorProdct.edit'), validateId, validateUpdateDoctorProdct, updateDoctorProdct);
router.delete('/:id', authenticate, authorize('doctorProdct.delete'), validateId, deleteDoctorProdct);

router.post('/:id/increment', authenticate, authorize('doctorProdct.edit'), validateAdjustQuantity, incrementQuantity);
router.post('/:id/decrement', authenticate, authorize('doctorProdct.edit'), validateAdjustQuantity, decrementQuantity);

export default router;
