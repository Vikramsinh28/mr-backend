import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateCreateDoctor, validateUpdateDoctor, validateId, validatePagination } from '../middlewares/validate.js';
import { listDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/', authenticate, authorize('doctor.view'), validatePagination, listDoctors);
router.get('/:id', authenticate, authorize('doctor.view'), validateId, getDoctorById);
router.post('/', authenticate, authorize('doctor.create'), validateCreateDoctor, createDoctor);
router.patch('/:id', authenticate, authorize('doctor.edit'), validateId, validateUpdateDoctor, updateDoctor);
router.delete('/:id', authenticate, authorize('doctor.delete'), validateId, deleteDoctor);

export default router;
