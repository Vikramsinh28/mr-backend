import { Role, Permission, User, UserRole, RolePermission } from '../models/index.js';
import { Op } from 'sequelize';
import { success, created, notFound, conflict, error as errorResponse } from '../utils/response.js';

/**
 * Create a new role
 * POST /api/roles
 * Requires: authenticate, authorize('role.create')
 */
export async function createRole(req, res, next) {
  try {
    const { name, description, isActive = true } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({
      where: { name }
    });

    if (existingRole) {
      return conflict(res, 'Role with this name already exists');
    }

    // Create role (validation handled by middleware)
    const role = await Role.create({
      name,
      description: description || null,
      isActive
    });

    return created(res, 'Role created successfully', { role });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all roles with their permissions
 * GET /api/roles
 * Requires: authenticate, authorize('role.view')
 */
export async function getAllRoles(req, res, next) {
  try {
    const { includePermissions = true } = req.query;

    const include = includePermissions === 'false' ? [] : [
      {
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
        required: false
      }
    ];

    const roles = await Role.findAll({
      include,
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Roles retrieved successfully', { roles });
  } catch (err) {
    next(err);
  }
}

/**
 * Get role by ID with permissions
 * GET /api/roles/:id
 * Requires: authenticate, authorize('role.view')
 */
export async function getRoleById(req, res, next) {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
          required: false
        },
        {
          model: User,
          as: 'users',
          through: { attributes: [] },
          required: false,
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!role) {
      return notFound(res, 'Role not found');
    }

    return success(res, 'Role retrieved successfully', { role });
  } catch (err) {
    next(err);
  }
}

/**
 * Update role
 * PATCH /api/roles/:id
 * Requires: authenticate, authorize('role.edit')
 */
export async function updateRole(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return notFound(res, 'Role not found');
    }

    // Check if name is being changed and already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({
        where: { name, id: { [Op.ne]: id } }
      });

      if (existingRole) {
        return conflict(res, 'Role name already exists');
      }
    }

    // Update role fields
    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (isActive !== undefined) role.isActive = isActive;

    await role.save();

    // Reload with permissions
    await role.reload({
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    return success(res, 'Role updated successfully', { role });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete role
 * DELETE /api/roles/:id
 * Requires: authenticate, authorize('role.delete')
 */
export async function deleteRole(req, res, next) {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return notFound(res, 'Role not found');
    }

    await role.destroy();

    return success(res, 'Role deleted successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * Assign permissions to a role
 * POST /api/roles/:id/permissions
 * Requires: authenticate, authorize('role.edit') or authorize('permission.assign')
 */
export async function assignPermissionsToRole(req, res, next) {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return notFound(res, 'Role not found');
    }

    // Verify all permissions exist
    const permissions = await Permission.findAll({
      where: { id: { [Op.in]: permissionIds } }
    });

    if (permissions.length !== permissionIds.length) {
      return errorResponse(res, 400, 'One or more permissions not found');
    }

    // Assign permissions to role (validation handled by middleware)
    await role.setPermissions(permissionIds);

    // Reload role with permissions
    await role.reload({
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    return success(res, 'Permissions assigned to role successfully', { role });
  } catch (err) {
    next(err);
  }
}

/**
 * Assign role to user
 * POST /api/roles/:roleId/assign-user
 * Requires: authenticate, authorize('user.edit')
 */
export async function assignRoleToUser(req, res, next) {
  try {
    const { roleId } = req.params;
    const { userId } = req.body;

    const role = await Role.findByPk(roleId);
    if (!role) {
      return notFound(res, 'Role not found');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return notFound(res, 'User not found');
    }

    // Check if role is already assigned
    const existingAssignment = await UserRole.findOne({
      where: { userId, roleId }
    });

    if (existingAssignment) {
      return conflict(res, 'Role is already assigned to this user');
    }

    // Assign role to user (validation handled by middleware)
    await user.addRole(roleId);

    return success(res, 'Role assigned to user successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      role: {
        id: role.id,
        name: role.name
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Remove role from user
 * DELETE /api/roles/:roleId/users/:userId
 * Requires: authenticate, authorize('user.edit')
 */
export async function removeRoleFromUser(req, res, next) {
  try {
    const { roleId, userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return notFound(res, 'User not found');
    }

    // Remove role from user
    await user.removeRole(roleId);

    return success(res, 'Role removed from user successfully');
  } catch (err) {
    next(err);
  }
}

