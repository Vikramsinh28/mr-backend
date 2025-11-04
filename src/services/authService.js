import bcrypt from 'bcryptjs';
import {
    Op
} from 'sequelize';
import {
    User
} from '../models/index.js';
import { generateToken as jwtGenerateToken } from '../utils/jwt.js';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Plain text password
 * @param {string} [userData.firstName] - First name (optional)
 * @param {string} [userData.lastName] - Last name (optional)
 * @returns {Promise<Object>} Created user object (without password)
 * @throws {Error} If user already exists or validation fails
 */
export async function registerUser(userData) {
    const {
        username,
        email,
        password,
        firstName,
        lastName
    } = userData;

    // Validate required fields
    if (!username || !email || !password) {
        throw new Error('Username, email, and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [{
                    email
                },
                {
                    username
                }
            ]
        }
    });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new Error('User with this email already exists');
        }
        if (existingUser.username === username) {
            throw new Error('Username already taken');
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        isActive: true
    });

    // Return user without password
    const userJSON = user.toJSON();
    delete userJSON.password;
    return userJSON;
}

/**
 * Login user and return JWT token
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email address or username
 * @param {string} credentials.password - Plain text password
 * @returns {Promise<Object>} Object containing token and user data
 * @throws {Error} If credentials are invalid
 */
export async function loginUser(credentials) {
    const {
        email,
        password
    } = credentials;

    // Validate required fields
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    // Find user by email or username
    const user = await User.findOne({
        where: {
            [Op.or]: [{
                    email
                },
                {
                    username: email
                }
            ]
        }
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
        throw new Error('Account is inactive. Please contact administrator');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwtGenerateToken({
        id: user.id,
        email: user.email,
        username: user.username
    });

    // Return user data without password
    const userJSON = user.toJSON();
    delete userJSON.password;

    return {
        token,
        user: userJSON
    };
}

/**
 * Generate JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export function generateToken(user) {
    return jwtGenerateToken({
        id: user.id,
        email: user.email,
        username: user.username
    });
}