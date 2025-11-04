import { User, Role, Permission } from '../models/index.js';
import { unauthorized, forbidden } from '../utils/response.js';

/**
 * Authorization middleware factory
 * Checks if the authenticated user has the required permission(s)
 * 
 * Usage:
 *   - authorize('user.create') - Check for single permission
 *   - authorize(['user.create', 'user.edit']) - Check for ANY permission (OR logic)
 *   - authorize(['user.create'], 'all') - Check for ALL permissions (AND logic)
 * 
 * @param {string|string[]} requiredPermission - Permission name(s) to check
 * @param {string} [mode='any'] - 'any' for OR logic, 'all' for AND logic
 * @returns {Function} Express middleware function
 */
export function authorize(requiredPermission, mode = 'any') {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated (should be set by authenticate middleware)
      if (!req.user || !req.user.id) {
        return unauthorized(res, 'Authentication required. Please login first.');
      }

      // Normalize permissions to array
      const requiredPermissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

      // Load user with all roles and their permissions
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Role,
            as: 'roles',
            where: { isActive: true }, // Only active roles
            required: false,
            include: [
              {
                model: Permission,
                as: 'permissions',
                required: false
              }
            ]
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Extract all permissions from all user's roles
      const userPermissions = new Set();
      user.roles.forEach(role => {
        role.permissions.forEach(permission => {
          userPermissions.add(permission.name);
        });
      });

      // Check permissions based on mode
      let hasPermission = false;

      if (mode === 'all') {
        // User must have ALL required permissions (AND logic)
        hasPermission = requiredPermissions.every(perm => userPermissions.has(perm));
      } else {
        // User must have at least ONE required permission (OR logic - default)
        hasPermission = requiredPermissions.some(perm => userPermissions.has(perm));
      }

      if (!hasPermission) {
        const permissionText = requiredPermissions.length === 1
          ? `permission '${requiredPermissions[0]}'`
          : `permissions: ${requiredPermissions.join(', ')}`;

        return forbidden(res, `Access denied. You do not have the required ${permissionText}.`, {
          required: requiredPermissions,
          userPermissions: Array.from(userPermissions)
        });
      }

      // Attach user permissions to request for potential use in controllers
      req.userPermissions = Array.from(userPermissions);
      req.userRoles = user.roles.map(role => role.name);

      // User has required permission(s), proceed
      next();
    } catch (err) {
      console.error('Authorization error:', err);
      err.statusCode = 500;
      err.message = 'Authorization check failed. Please try again.';
      next(err);
    }
  };
}

/**
 * Check if user has any of the specified roles
 * 
 * @param {string|string[]} requiredRoles - Role name(s) to check
 * @returns {Function} Express middleware function
 */
export function hasRole(requiredRoles) {
  return async (req, res, next) => {
    try {
    if (!req.user || !req.user.id) {
      return unauthorized(res, 'Authentication required. Please login first.');
    }

      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      // Load user with roles
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Role,
            as: 'roles',
            where: { isActive: true },
            required: false
          }
        ]
      });

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    const userRoleNames = user.roles.map(role => role.name);
    const hasRequiredRole = roles.some(role => userRoleNames.includes(role));

    if (!hasRequiredRole) {
      const roleText = roles.length === 1
        ? `role '${roles[0]}'`
        : `roles: ${roles.join(', ')}`;

      return forbidden(res, `Access denied. You must have the ${roleText}.`, {
        required: roles,
        userRoles: userRoleNames
      });
    }

      req.userRoles = userRoleNames;
      next();
    } catch (err) {
      console.error('Role check error:', err);
      err.statusCode = 500;
      err.message = 'Role check failed. Please try again.';
      next(err);
    }
  };
}

