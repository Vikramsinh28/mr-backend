import { Permission, Role } from '../models/index.js';
import { Op } from 'sequelize';
import { success, created, notFound, conflict } from '../utils/response.js';

/**
 * Create a new permission
 * POST /api/permissions
 * Requires: authenticate, authorize('permission.create')
 */
export async function createPermission(req, res, next) {
  try {
    const { name, description, resource, action } = req.body;

    // Check if permission already exists
    const existingPermission = await Permission.findOne({
      where: { name }
    });

    if (existingPermission) {
      return conflict(res, 'Permission with this name already exists');
    }

    // Create permission (validation handled by middleware)
    const permission = await Permission.create({
      name,
      description: description || null,
      resource: resource || null,
      action: action || null
    });

    return created(res, 'Permission created successfully', { permission });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all permissions
 * GET /api/permissions
 * Requires: authenticate, authorize('permission.view')
 */
export async function getAllPermissions(req, res, next) {
  try {
    const { includeRoles = false, resource, action } = req.query;

    const where = {};
    if (resource) where.resource = resource;
    if (action) where.action = action;

    const include = includeRoles === 'true' ? [
      {
        model: Role,
        as: 'roles',
        through: { attributes: [] },
        required: false
      }
    ] : [];

    const permissions = await Permission.findAll({
      where,
      include,
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Permissions retrieved successfully', { permissions });
  } catch (err) {
    next(err);
  }
}

/**
 * Get permission by ID
 * GET /api/permissions/:id
 * Requires: authenticate, authorize('permission.view')
 */
export async function getPermissionById(req, res, next) {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          required: false
        }
      ]
    });

    if (!permission) {
      return notFound(res, 'Permission not found');
    }

    return success(res, 'Permission retrieved successfully', { permission });
  } catch (err) {
    next(err);
  }
}

/**
 * Update permission
 * PATCH /api/permissions/:id
 * Requires: authenticate, authorize('permission.edit')
 */
export async function updatePermission(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, resource, action } = req.body;

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return notFound(res, 'Permission not found');
    }

    // Check if name is being changed and already exists
    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({
        where: { name, id: { [Op.ne]: id } }
      });

      if (existingPermission) {
        return conflict(res, 'Permission name already exists');
      }
    }

    // Update permission fields
    if (name) permission.name = name;
    if (description !== undefined) permission.description = description;
    if (resource !== undefined) permission.resource = resource;
    if (action !== undefined) permission.action = action;

    await permission.save();

    return success(res, 'Permission updated successfully', { permission });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete permission
 * DELETE /api/permissions/:id
 * Requires: authenticate, authorize('permission.delete')
 */
export async function deletePermission(req, res, next) {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return notFound(res, 'Permission not found');
    }

    await permission.destroy();

    return success(res, 'Permission deleted successfully');
  } catch (err) {
    next(err);
  }
}

