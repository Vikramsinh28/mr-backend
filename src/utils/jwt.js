import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {number} payload.id - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.username - Username
 * @param {string} [expiresIn] - Token expiration (default: 1d)
 * @returns {string} Signed JWT token
 */
export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn
  });
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Decode JWT token without verification (useful for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload (not verified)
 */
export function decodeToken(token) {
  return jwt.decode(token);
}

export { JWT_SECRET, JWT_EXPIRES_IN };

