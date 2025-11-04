import { Company } from '../models/index.js';
import { Op } from 'sequelize';
import { success, created, notFound, error as errorResponse, conflict } from '../utils/response.js';

/**
 * Get all companies
 * GET /api/companies
 * Requires: authenticate, authorize('company.view')
 */
export async function getAllCompanies(req, res, next) {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { domain: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { gstNumber: { [Op.iLike]: `%${search}%` } },
        { panNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Company.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Companies retrieved successfully', {
      companies: rows,
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
 * Get company by ID
 * GET /api/companies/:id
 * Requires: authenticate, authorize('company.view')
 */
export async function getCompanyById(req, res, next) {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return notFound(res, 'Company not found');
    }

    return success(res, 'Company retrieved successfully', { company });
  } catch (err) {
    next(err);
  }
}

/**
 * Create new company
 * POST /api/companies
 * Requires: authenticate, authorize('company.create')
 */
export async function createCompany(req, res, next) {
  try {
    const {
      name,
      domain,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      email,
      website,
      gstNumber,
      panNumber,
      registrationNumber,
      contactPerson,
      contactPhone,
      fax,
      industry,
      description,
      isActive
    } = req.body;

    // Check if company with same domain exists
    const existingCompany = await Company.findOne({
      where: { domain }
    });

    if (existingCompany) {
      return conflict(res, 'Company with this domain already exists');
    }

    // Check if GST number already exists (if provided)
    if (gstNumber) {
      const existingGST = await Company.findOne({
        where: { gstNumber }
      });

      if (existingGST) {
        return conflict(res, 'Company with this GST number already exists');
      }
    }

    // Check if PAN number already exists (if provided)
    if (panNumber) {
      const existingPAN = await Company.findOne({
        where: { panNumber }
      });

      if (existingPAN) {
        return conflict(res, 'Company with this PAN number already exists');
      }
    }

    // Create company
    const company = await Company.create({
      name,
      domain,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      email,
      website,
      gstNumber,
      panNumber,
      registrationNumber,
      contactPerson,
      contactPhone,
      fax,
      industry,
      description,
      isActive: isActive !== undefined ? isActive : true
    });

    return created(res, 'Company created successfully', { company });
  } catch (err) {
    next(err);
  }
}

/**
 * Update company
 * PATCH /api/companies/:id
 * Requires: authenticate, authorize('company.edit')
 */
export async function updateCompany(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      domain,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      email,
      website,
      gstNumber,
      panNumber,
      registrationNumber,
      contactPerson,
      contactPhone,
      fax,
      industry,
      description,
      isActive
    } = req.body;

    const company = await Company.findByPk(id);

    if (!company) {
      return notFound(res, 'Company not found');
    }

    // Check if domain is being changed and already exists
    if (domain && domain !== company.domain) {
      const existingCompany = await Company.findOne({
        where: {
          id: { [Op.ne]: id },
          domain
        }
      });

      if (existingCompany) {
        return conflict(res, 'Company with this domain already exists');
      }
    }

    // Check if GST number is being changed and already exists
    if (gstNumber && gstNumber !== company.gstNumber) {
      const existingGST = await Company.findOne({
        where: {
          id: { [Op.ne]: id },
          gstNumber
        }
      });

      if (existingGST) {
        return conflict(res, 'Company with this GST number already exists');
      }
    }

    // Check if PAN number is being changed and already exists
    if (panNumber && panNumber !== company.panNumber) {
      const existingPAN = await Company.findOne({
        where: {
          id: { [Op.ne]: id },
          panNumber
        }
      });

      if (existingPAN) {
        return conflict(res, 'Company with this PAN number already exists');
      }
    }

    // Update company fields
    if (name !== undefined) company.name = name;
    if (domain !== undefined) company.domain = domain;
    if (address !== undefined) company.address = address;
    if (city !== undefined) company.city = city;
    if (state !== undefined) company.state = state;
    if (country !== undefined) company.country = country;
    if (postalCode !== undefined) company.postalCode = postalCode;
    if (phone !== undefined) company.phone = phone;
    if (email !== undefined) company.email = email;
    if (website !== undefined) company.website = website;
    if (gstNumber !== undefined) company.gstNumber = gstNumber;
    if (panNumber !== undefined) company.panNumber = panNumber;
    if (registrationNumber !== undefined) company.registrationNumber = registrationNumber;
    if (contactPerson !== undefined) company.contactPerson = contactPerson;
    if (contactPhone !== undefined) company.contactPhone = contactPhone;
    if (fax !== undefined) company.fax = fax;
    if (industry !== undefined) company.industry = industry;
    if (description !== undefined) company.description = description;
    if (isActive !== undefined) company.isActive = isActive;

    await company.save();

    return success(res, 'Company updated successfully', { company });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete company
 * DELETE /api/companies/:id
 * Requires: authenticate, authorize('company.delete')
 */
export async function deleteCompany(req, res, next) {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return notFound(res, 'Company not found');
    }

    await company.destroy();

    return success(res, 'Company deleted successfully');
  } catch (err) {
    next(err);
  }
}

