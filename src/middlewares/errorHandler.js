import { error } from '../utils/response.js';

/**
 * Global error handler middleware
 * Catches all errors from controllers and services
 * Sends standardized error responses
 */
export function errorHandler(err, req, res, next) {
  // Log error details
  console.error('Error:', {
    status: err.status || err.statusCode || 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method
  });

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const validationErrors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));

    return error(res, 400, 'Validation failed', {
      errors: validationErrors
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const constraintErrors = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} must be unique`,
      value: e.value
    }));

    const field = err.errors[0]?.path || 'field';
    return error(res, 409, `${field} already exists`, {
      errors: constraintErrors
    });
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return error(res, 400, 'The referenced record does not exist', {
      message: err.message
    });
  }

  // Sequelize database connection errors
  if (err.name === 'SequelizeConnectionError') {
    return error(res, 503, 'Database connection error', {
      message: 'Unable to connect to database'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return error(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return error(res, 401, 'Token has expired');
  }

  // Custom application errors with status code
  if (err.statusCode || err.status) {
    const statusCode = err.statusCode || err.status;
    return error(res, statusCode, err.message, err.details || {});
  }

  // Default server error (500)
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  const details = process.env.NODE_ENV === 'development' ? {
    stack: err.stack,
    originalError: err.name
  } : {};

  return error(res, 500, message, details);
}

/**
 * Async handler wrapper
 * Automatically catches errors from async route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
