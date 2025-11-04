import {
  User
} from '../models/index.js';
import {
  verifyToken
} from '../utils/jwt.js';

/**
 * Middleware to authenticate JWT tokens
 * Verifies the JWT token from Authorization header and loads user into req.user
 */
export async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'No token provided. Please provide a valid authentication token.');
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return unauthorized(res, 'Invalid token format');
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.message === 'Token has expired') {
        return unauthorized(res, 'Token has expired. Please login again.');
      }
      if (err.message === 'Invalid token') {
        return unauthorized(res, 'Invalid token. Please login again.');
      }
      throw err;
    }

    // Load user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return unauthorized(res, 'User not found. Token is invalid.');
    }

    // Check if user is active
    if (!user.isActive) {
      return forbidden(res, 'Account is inactive. Please contact administrator.');
    }

    // Attach user to request object
    // Remove password from user object
    const userJSON = user.toJSON();
    delete userJSON.password;
    req.user = userJSON;

    // Continue to next middleware
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    err.statusCode = 500;
    err.message = 'Authentication failed. Please try again.';
    next(err);
  }
}