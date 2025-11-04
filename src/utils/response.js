/**
 * Unified response utility functions
 * Provides consistent response format across all APIs
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Express response
 */
export function success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} message - Error message
 * @param {Object} details - Error details/context
 * @returns {Object} Express response
 */
export function error(res, statusCode = 400, message, details = {}) {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(Object.keys(details).length > 0 && {
            details
        })
    });
}

/**
 * Send created response (201)
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @returns {Object} Express response
 */
export function created(res, message, data = {}) {
    return success(res, message, data, 201);
}

/**
 * Send not found response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export function notFound(res, message = 'Resource not found') {
    return error(res, 404, message);
}

/**
 * Send unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export function unauthorized(res, message = 'Unauthorized') {
    return error(res, 401, message);
}

/**
 * Send forbidden response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
export function forbidden(res, message = 'Forbidden') {
    return error(res, 403, message);
}

/**
 * Send conflict response (409)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Object} details - Conflict details
 * @returns {Object} Express response
 */
export function conflict(res, message = 'Conflict', details = {}) {
    return error(res, 409, message, details);
}