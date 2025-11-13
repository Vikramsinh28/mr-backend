import * as authService from "../services/authService.js";
import { success, created, notFound } from "../utils/response.js";
import { User } from "../models/index.js";

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Register user (validation is handled by middleware)
    const user = await authService.registerUser({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // Generate token for new user
    const token = authService.generateToken(user);

    return created(res, "User registered successfully", {
      token,
      user,
    });
  } catch (err) {
    // Pass to error handler
    next(err);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Attempt login (validation is handled by middleware)
    const result = await authService.loginUser({ email, password });

    return success(res, "Login successful", result);
  } catch (err) {
    // Handle authentication errors with custom status
    if (err.message.includes("Invalid email or password")) {
      err.statusCode = 401;
    }
    if (err.message.includes("Account is inactive")) {
      err.statusCode = 403;
    }
    // Pass to error handler
    next(err);
  }
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires: authenticate middleware
 */
export async function getCurrentUser(req, res, next) {
  try {
    // User is already attached to req by authenticate middleware
    return success(res, "User retrieved successfully", {
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current authenticated user profile with roles and permissions
 * GET /api/auth/profile
 * Requires: authenticate middleware
 */
export async function getProfile(req, res, next) {
  try {
    // Load user with roles and permissions
    // Using explicit through options to ensure correct column names
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return notFound(res, "User not found");
    }

    // Filter active roles and extract all permissions
    const activeRoles = user.roles.filter((role) => role.isActive);
    const allPermissions = [];

    activeRoles.forEach((role) => {
      if (role.permissions) {
        role.permissions.forEach((permission) => {
          if (!allPermissions.find((p) => p.id === permission.id)) {
            allPermissions.push(permission);
          }
        });
      }
    });

    // Return user with only active roles and all permissions
    const userJSON = user.toJSON();
    userJSON.roles = activeRoles;

    return success(res, "Profile retrieved successfully", {
      user: {
        ...userJSON,
        permissions: allPermissions,
      },
    });
  } catch (err) {
    next(err);
  }
}
