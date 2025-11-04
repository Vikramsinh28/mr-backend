import { Department, Company, User } from '../models/index.js';
import { Op } from 'sequelize';
import { success, created, notFound, conflict, error as errorResponse } from '../utils/response.js';

/**
 * Get all departments
 * GET /api/departments
 * Requires: authenticate, authorize('department.view')
 */
export async function getAllDepartments(req, res, next) {
  try {
    const { page = 1, limit = 10, search, companyId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (companyId) {
      where.companyId = parseInt(companyId);
    }

    const { count, rows } = await Department.findAndCountAll({
      where,
      include: [
        {
          model: Company,
          as: 'company',
          required: false,
          attributes: ['id', 'name', 'domain']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Departments retrieved successfully', {
      departments: rows,
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
 * Get department by ID
 * GET /api/departments/:id
 * Requires: authenticate, authorize('department.view')
 */
export async function getDepartmentById(req, res, next) {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: Company,
          as: 'company',
          required: false,
          attributes: ['id', 'name', 'domain']
        },
        {
          model: User,
          as: 'users',
          through: { attributes: ['assignedAt'] },
          required: false,
          attributes: ['id', 'username', 'email', 'firstName', 'lastName']
        }
      ]
    });

    if (!department) {
      return notFound(res, 'Department not found');
    }

    return success(res, 'Department retrieved successfully', { department });
  } catch (err) {
    next(err);
  }
}

/**
 * Create new department
 * POST /api/departments
 * Requires: authenticate, authorize('department.create')
 */
export async function createDepartment(req, res, next) {
  try {
    const { name, description, companyId, isActive } = req.body;

    // Check if company exists
    const company = await Company.findByPk(companyId);
    if (!company) {
      return notFound(res, 'Company not found');
    }

    // Check if department with same name already exists in the company
    const existingDepartment = await Department.findOne({
      where: {
        name,
        companyId
      }
    });

    if (existingDepartment) {
      return conflict(res, 'Department with this name already exists in the company');
    }

    // Create department
    const department = await Department.create({
      name,
      description: description || null,
      companyId,
      isActive: isActive !== undefined ? isActive : true
    });

    // Reload with company association
    await department.reload({
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'domain']
        }
      ]
    });

    return created(res, 'Department created successfully', { department });
  } catch (err) {
    next(err);
  }
}

/**
 * Update department
 * PATCH /api/departments/:id
 * Requires: authenticate, authorize('department.edit')
 */
export async function updateDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, companyId, isActive } = req.body;

    const department = await Department.findByPk(id);

    if (!department) {
      return notFound(res, 'Department not found');
    }

    // Check if company exists if companyId is being updated
    if (companyId && companyId !== department.companyId) {
      const company = await Company.findByPk(companyId);
      if (!company) {
        return notFound(res, 'Company not found');
      }
    }

    // Check if department with same name already exists in the company (if name or company is being changed)
    if (name && (name !== department.name || companyId !== department.companyId)) {
      const existingDepartment = await Department.findOne({
        where: {
          id: { [Op.ne]: id },
          name,
          companyId: companyId || department.companyId
        }
      });

      if (existingDepartment) {
        return conflict(res, 'Department with this name already exists in the company');
      }
    }

    // Update department fields
    if (name !== undefined) department.name = name;
    if (description !== undefined) department.description = description;
    if (companyId !== undefined) department.companyId = companyId;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();

    // Reload with associations
    await department.reload({
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'domain']
        }
      ]
    });

    return success(res, 'Department updated successfully', { department });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete department
 * DELETE /api/departments/:id
 * Requires: authenticate, authorize('department.delete')
 */
export async function deleteDepartment(req, res, next) {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);

    if (!department) {
      return notFound(res, 'Department not found');
    }

    await department.destroy();

    return success(res, 'Department deleted successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * Assign users to department
 * POST /api/departments/:id/users
 * Requires: authenticate, authorize('department.edit')
 */
export async function assignUsersToDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return errorResponse(res, 400, 'userIds must be a non-empty array');
    }

    const department = await Department.findByPk(id);
    if (!department) {
      return notFound(res, 'Department not found');
    }

    // Verify all users exist
    const users = await User.findAll({
      where: {
        id: { [Op.in]: userIds }
      }
    });

    if (users.length !== userIds.length) {
      return errorResponse(res, 400, 'One or more users not found');
    }

    // Assign users to department
    await department.setUsers(userIds);

    // Reload department with users
    await department.reload({
      include: [
        {
          model: User,
          as: 'users',
          through: { attributes: ['assignedAt'] },
          attributes: ['id', 'username', 'email', 'firstName', 'lastName']
        }
      ]
    });

    return success(res, 'Users assigned to department successfully', { department });
  } catch (err) {
    next(err);
  }
}

/**
 * Remove users from department
 * DELETE /api/departments/:id/users
 * Requires: authenticate, authorize('department.edit')
 */
export async function removeUsersFromDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return errorResponse(res, 400, 'userIds must be a non-empty array');
    }

    const department = await Department.findByPk(id);
    if (!department) {
      return notFound(res, 'Department not found');
    }

    // Remove users from department
    await department.removeUsers(userIds);

    return success(res, 'Users removed from department successfully');
  } catch (err) {
    next(err);
  }
}

