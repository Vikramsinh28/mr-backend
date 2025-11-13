import { Op } from 'sequelize';
import { Category, User } from '../models/index.js';
import { success, created, notFound, forbidden } from '../utils/response.js';

export const listCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) where.categoryName = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Category.findAndCountAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'email'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Categories retrieved successfully', { categories: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, { include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'email'] }] });
    if (!category) return notFound(res, 'Category not found');
    return success(res, 'Category retrieved successfully', { category });
  } catch (err) { next(err); }
};

export const createCategory = async (req, res, next) => {
  try {
    const { category_name, categoryName, description } = req.body;
    const category = await Category.create({ categoryName: category_name ?? categoryName, description, createdBy: req.user.id });
    await category.reload({ include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'email'] }] });
    return created(res, 'Category created successfully', { category });
  } catch (err) { next(err); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return notFound(res, 'Category not found');
    if (category.createdBy !== req.user.id && !req.userPermissions?.includes('category.edit')) return forbidden(res, 'You are not allowed to update this category');

    const { category_name, categoryName, description } = req.body;
    if (category_name !== undefined || categoryName !== undefined) category.categoryName = category_name ?? categoryName;
    if (description !== undefined) category.description = description;
    category.updatedBy = req.user.id;

    await category.save();
    await category.reload({ include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'email'] }] });
    return success(res, 'Category updated successfully', { category });
  } catch (err) { next(err); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return notFound(res, 'Category not found');
    if (category.createdBy !== req.user.id && !req.userPermissions?.includes('category.delete')) return forbidden(res, 'You are not allowed to delete this category');
    await category.destroy();
    return success(res, 'Category deleted successfully');
  } catch (err) { next(err); }
};
