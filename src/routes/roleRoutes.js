import express from 'express';
import * as roleController from '../controllers/roleController.js';
import {
  authenticate
} from '../middlewares/authenticate.js';
import {
  authorize
} from '../middlewares/authorize.js';
import { validateCreateRole, validateUpdateRole, validateAssignPermissions, validateAssignRole, validateId } from '../middlewares/validate.js';

const router = express.Router();

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     description: Create a new role in the system. Requires role.create permission.
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
 *                 example: manager
 *                 description: Unique role name
 *               description:
 *                 type: string
 *                 example: Manager role with elevated permissions
 *                 description: Role description
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 default: true
 *     responses:
 *       201:
 *         description: Role created successfully
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
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing role.create permission
 *       409:
 *         description: Role name already exists
 */
router.post('/', authenticate, authorize('role.create'), validateCreateRole, roleController.createRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     description: Retrieve all roles with their permissions. Requires role.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: includePermissions
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Whether to include permissions in response
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
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
 *                     roles:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Role'
 *                           - type: object
 *                             properties:
 *                               permissions:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Permission'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing role.view permission
 */
router.get('/', authenticate, authorize('role.view'), roleController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     description: Retrieve a specific role by ID with permissions and assigned users. Requires role.view permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing role.view permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, authorize('role.view'), validateId, roleController.getRoleById);

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     summary: Update role
 *     tags: [Roles]
 *     description: Update role information. Requires role.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing role.edit permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/:id', authenticate, authorize('role.edit'), validateId, validateUpdateRole, roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 *     description: Delete a role from the system. Requires role.delete permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing role.delete permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', authenticate, authorize('role.delete'), validateId, roleController.deleteRole);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   post:
 *     summary: Assign permissions to role
 *     tags: [Roles]
 *     description: Assign one or more permissions to a role. Requires role.edit or permission.assign permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: Array of permission IDs to assign
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
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
 *                     role:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Role'
 *                         - type: object
 *                           properties:
 *                             permissions:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Permission'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing required permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/:id/permissions', 
  authenticate, 
  authorize(['role.edit', 'permission.assign']), 
  validateAssignPermissions,
  roleController.assignPermissionsToRole
);

/**
 * @swagger
 * /api/roles/{roleId}/assign-user:
 *   post:
 *     summary: Assign role to user
 *     tags: [Roles]
 *     description: Assign a role to a user. Requires user.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: User ID to assign the role to
 *     responses:
 *       200:
 *         description: Role assigned to user successfully
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
 *                     user:
 *                       type: object
 *                     role:
 *                       type: object
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing user.edit permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Role already assigned to user
 */
router.post('/:roleId/assign-user', 
  authenticate, 
  authorize('user.edit'), 
  validateAssignRole,
  roleController.assignRoleToUser
);

/**
 * @swagger
 * /api/roles/{roleId}/users/{userId}:
 *   delete:
 *     summary: Remove role from user
 *     tags: [Roles]
 *     description: Remove a role from a user. Requires user.edit permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Role removed from user successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Missing user.edit permission
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:roleId/users/:userId',
  authenticate,
  authorize('user.edit'),
  roleController.removeRoleFromUser
);

export default router;