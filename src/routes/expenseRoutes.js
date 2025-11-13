import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateCreateExpense, validateUpdateExpense, validateId, validatePagination, validateApproveExpense } from '../middlewares/validate.js';

const router = express.Router();

// List expenses
router.get('/', authenticate, authorize('expense.view'), validatePagination, expenseController.listExpenses);

// Get expense by ID
router.get('/:id', authenticate, authorize('expense.view'), validateId, expenseController.getExpenseById);

// Create expense
router.post('/', authenticate, authorize('expense.create'), validateCreateExpense, expenseController.createExpense);

// Update expense
router.patch('/:id', authenticate, authorize('expense.edit'), validateId, validateUpdateExpense, expenseController.updateExpense);

// Delete expense
router.delete('/:id', authenticate, authorize('expense.delete'), validateId, expenseController.deleteExpense);

// Approve expense
router.post('/:id/approve', authenticate, authorize('expense.approve'), validateApproveExpense, expenseController.approveExpense);

export default router;
