import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validatePagination, validateId, validateCreateVisitPlanning, validateUpdateVisitPlanning, validateCreateCompleteVisit, validateUpdateCompleteVisit } from '../middlewares/validate.js';
import { listVisitPlannings, getVisitPlanningById, createVisitPlanning, updateVisitPlanning, deleteVisitPlanning, listCompleteVisits, getCompleteVisitById, createCompleteVisit, updateCompleteVisit, deleteCompleteVisit } from '../controllers/visitController.js';

const router = express.Router();

// Visit planning
router.get('/planning', authenticate, authorize('visitPlanning.view'), validatePagination, listVisitPlannings);
router.get('/planning/:id', authenticate, authorize('visitPlanning.view'), validateId, getVisitPlanningById);
router.post('/planning', authenticate, authorize('visitPlanning.create'), validateCreateVisitPlanning, createVisitPlanning);
router.patch('/planning/:id', authenticate, authorize('visitPlanning.edit'), validateId, validateUpdateVisitPlanning, updateVisitPlanning);
router.delete('/planning/:id', authenticate, authorize('visitPlanning.delete'), validateId, deleteVisitPlanning);

// Complete visit
router.get('/complete', authenticate, authorize('completeVisit.view'), validatePagination, listCompleteVisits);
router.get('/complete/:id', authenticate, authorize('completeVisit.view'), validateId, getCompleteVisitById);
router.post('/complete', authenticate, authorize('completeVisit.create'), validateCreateCompleteVisit, createCompleteVisit);
router.patch('/complete/:id', authenticate, authorize('completeVisit.edit'), validateId, validateUpdateCompleteVisit, updateCompleteVisit);
router.delete('/complete/:id', authenticate, authorize('completeVisit.delete'), validateId, deleteCompleteVisit);

export default router;
