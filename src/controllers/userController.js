import { User, Role, UserRole } from '../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { success, created, notFound, error as errorResponse, conflict } from '../utils/response.js';

/**
 * Get all users
 * GET /api/users
 * Requires: authenticate, authorize('user.view')
 */
export async function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Users retrieved successfully', {
      users: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get user by ID
 * GET /api/users/:id
 * Requires: authenticate, authorize('user.view')
 */
export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          required: false
        }
      ]
    });

    if (!user) {
      return notFound(res, 'User not found');
    }

    return success(res, 'User retrieved successfully', { user });
  } catch (err) {
    next(err);
  }
}

/**
 * Create new user
 * POST /api/users
 * Requires: authenticate, authorize('user.create')
 */
export async function createUser(req, res, next) {
  try {
    const { username, email, password, firstName, lastName, roleIds } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return conflict(res, 
        existingUser.email === email ? 'Email already exists' : 'Username already taken'
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isActive: true
    });

    // Assign roles if provided
    if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
      await user.setRoles(roleIds);
    }

    // Reload user with roles
    await user.reload({
      include: [{ model: Role, as: 'roles', through: { attributes: [] } }],
      attributes: { exclude: ['password'] }
    });

    return created(res, 'User created successfully', { user });
  } catch (err) {
    next(err);
  }
}

/**
 * Update user
 * PATCH /api/users/:id
 * Requires: authenticate, authorize('user.edit')
 */
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, isActive, roleIds } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if email/username already taken by another user
    if (email || username) {
      const existingUser = await User.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [{ email }, { username }].filter(Boolean)
        }
      });

      if (existingUser) {
      return conflict(res, 'Email or username already taken');
    }
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Update roles if provided
    if (roleIds !== undefined && Array.isArray(roleIds)) {
      await user.setRoles(roleIds);
    }

    // Reload user with roles
    await user.reload({
      include: [{ model: Role, as: 'roles', through: { attributes: [] } }],
      attributes: { exclude: ['password'] }
    });

    return success(res, 'User updated successfully', { user });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete user
 * DELETE /api/users/:id
 * Requires: authenticate, authorize('user.delete')
 */
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (parseInt(id) === req.user.id) {
      return errorResponse(res, 400, 'You cannot delete your own account');
    }

    const user = await User.findByPk(id);

    if (!user) {
      return notFound(res, 'User not found');
    }

    await user.destroy();

    return success(res, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
}

