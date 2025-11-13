import { Op } from 'sequelize';
import { Product, Category, User } from '../models/index.js';
import { success, created, notFound, forbidden } from '../utils/response.js';

export const listProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category_id } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { description: { [Op.iLike]: `%${search}%` } }];
    if (category_id) where.categoryId = parseInt(category_id);

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'categoryName'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Products retrieved successfully', { products: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { include: [{ model: Category, as: 'category', attributes: ['id', 'categoryName'] }, { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }, { model: User, as: 'updater', attributes: ['id', 'username', 'email'] }] });
    if (!product) return notFound(res, 'Product not found');
    return success(res, 'Product retrieved successfully', { product });
  } catch (err) { next(err); }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category_id, categoryId } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      categoryId: category_id ?? categoryId,
      createdBy: req.user.id
    });

    await product.reload({ include: [{ model: Category, as: 'category', attributes: ['id', 'categoryName'] }, { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }] });

    return created(res, 'Product created successfully', { product });
  } catch (err) { next(err); }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return notFound(res, 'Product not found');
    if (product.createdBy !== req.user.id && !req.userPermissions?.includes('product.edit')) return forbidden(res, 'You are not allowed to update this product');

    const { name, price, description, category_id, categoryId } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (category_id !== undefined || categoryId !== undefined) product.categoryId = category_id ?? categoryId;
    product.updatedBy = req.user.id;

    await product.save();
    await product.reload({ include: [{ model: Category, as: 'category', attributes: ['id', 'categoryName'] }, { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }, { model: User, as: 'updater', attributes: ['id', 'username', 'email'] }] });

    return success(res, 'Product updated successfully', { product });
  } catch (err) { next(err); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return notFound(res, 'Product not found');
    if (product.createdBy !== req.user.id && !req.userPermissions?.includes('product.delete')) return forbidden(res, 'You are not allowed to delete this product');
    await product.destroy();
    return success(res, 'Product deleted successfully');
  } catch (err) { next(err); }
};
