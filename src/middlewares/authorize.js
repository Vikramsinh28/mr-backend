// Authorization middleware is disabled. All role/permission checks are no-ops.
// This preserves existing route signatures without enforcing RBAC.

/**
 * No-op permission check. Always allows the request to proceed.
 * Keeps route usage `authorize('perm')` or `authorize(['a','b'], 'all')` intact.
 */
export function authorize(requiredPermission, mode = 'any') {
  return (req, res, next) => {
    // Clear any previous RBAC context and proceed
    req.userPermissions = [];
    req.userRoles = [];
    next();
  };
}

/**
 * No-op role check. Always allows the request to proceed.
 * Keeps route usage `hasRole('admin')` compatible.
 */
export function hasRole(requiredRoles) {
  return (req, res, next) => {
    req.userRoles = [];
    next();
  };
}
