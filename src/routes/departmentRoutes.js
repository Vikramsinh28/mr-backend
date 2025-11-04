import express from 'express';
import * as departmentController from '../controllers/departmentController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateCreateDepartment, validateUpdateDepartment, validateId, validatePagination, validateAssignUsersToDepartment, validateRemoveUsersFromDepartment } from '../middlewares/validate.js';

const router = express.Router();

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     description: Retrieve a paginated list of all departments. Requires department.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         description: Filter by company ID
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing department.view permission
 */
router.get('/', authenticate, authorize('department.view'), validatePagination, departmentController.getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     description: Retrieve a specific department by ID with company and users. Requires department.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *       404:
 *         description: Department not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing department.view permission
 */
router.get('/:id', authenticate, authorize('department.view'), validateId, departmentController.getDepartmentById);

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create new department
 *     tags: [Departments]
 *     description: Create a new department. Requires department.create permission.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Engineering
 *               description:
 *                 type: string
 *                 example: Handles software & tech
 *               companyId:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing department.create permission
 *       409:
 *         description: Department with this name already exists in the company
 */
router.post('/', authenticate, authorize('department.create'), validateCreateDepartment, departmentController.createDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   patch:
 *     summary: Update department
 *     tags: [Departments]
 *     description: Update department information. Requires department.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing department.edit permission
 *       409:
 *         description: Department with this name already exists in the company
 */
router.patch('/:id', authenticate, authorize('department.edit'), validateId, validateUpdateDepartment, departmentController.updateDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 *     description: Delete a department. Requires department.delete permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing department.delete permission
 */
router.delete('/:id', authenticate, authorize('department.delete'), validateId, departmentController.deleteDepartment);

/**
 * @swagger
 * /api/departments/{id}/users:
 *   post:
 *     summary: Assign users to department
 *     tags: [Departments]
 *     description: Assign multiple users to a department. Requires department.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Users assigned to department successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing department.edit permission
 */
router.post('/:id/users', authenticate, authorize('department.edit'), validateAssignUsersToDepartment, departmentController.assignUsersToDepartment);

/**
 * @swagger
 * /api/departments/{id}/users:
 *   delete:
 *     summary: Remove users from department
 *     tags: [Departments]
 *     description: Remove multiple users from a department. Requires department.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Users removed from department successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing department.edit permission
 */
router.delete('/:id/users', authenticate, authorize('department.edit'), validateRemoveUsersFromDepartment, departmentController.removeUsersFromDepartment);

export default router;

