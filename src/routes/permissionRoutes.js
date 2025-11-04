import express from 'express';
import * as permissionController from '../controllers/permissionController.js';
import {
  authenticate
} from '../middlewares/authenticate.js';
import {
  authorize
} from '../middlewares/authorize.js';
import { validateCreatePermission, validateUpdatePermission, validateId } from '../middlewares/validate.js';

const router = express.Router();

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     description: Create a new permission in the system. Requires permission.create permission.
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: order.delete
 *                 description: "Unique permission name (format: resource.action)"
 *               description:
 *                 type: string
 *                 example: Delete orders
 *                 description: Permission description
 *               resource:
 *                 type: string
 *                 example: order
 *                 description: Resource type (optional)
 *               action:
 *                 type: string
 *                 example: delete
 *                 description: Action type (optional)
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     permission:
 *                       $ref: '#/components/schemas/Permission'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing permission.create permission
 *       409:
 *         description: Permission name already exists
 */
router.post('/', authenticate, authorize('permission.create'), validateCreatePermission, permissionController.createPermission);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     description: Retrieve all available permissions. Requires permission.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includeRoles
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to include roles that have this permission
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *         description: Filter by resource type
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Permission'
 *                           - type: object
 *                             properties:
 *                               roles:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Role'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing permission.view permission
 */
router.get('/', authenticate, authorize('permission.view'), permissionController.getAllPermissions);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     description: Retrieve a specific permission by ID with roles that have it. Requires permission.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing permission.view permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, authorize('permission.view'), validateId, permissionController.getPermissionById);

/**
 * @swagger
 * /api/permissions/{id}:
 *   patch:
 *     summary: Update permission
 *     tags: [Permissions]
 *     description: Update permission information. Requires permission.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Permission ID
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
 *               resource:
 *                 type: string
 *               action:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing permission.edit permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id', authenticate, authorize('permission.edit'), validateId, validateUpdatePermission, permissionController.updatePermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete permission
 *     tags: [Permissions]
 *     description: Delete a permission from the system. Requires permission.delete permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing permission.delete permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', authenticate, authorize('permission.delete'), validateId, permissionController.deletePermission);

export default router;