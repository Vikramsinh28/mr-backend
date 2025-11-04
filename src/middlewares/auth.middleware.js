/**
 * Authentication Middleware (Alias)
 * Re-exports the authenticate middleware for consistency
 * Can be used as: import { authenticate } from './auth.middleware.js'
 */
export {
    authenticate as
    default, authenticate
}
from './authenticate.js';