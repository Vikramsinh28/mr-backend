import { Op } from 'sequelize';
import { DoctorProdct, Product, Doctor, User } from '../models/index.js';
import { success, created, notFound, forbidden, conflict } from '../utils/response.js';

export const listDoctorProdcts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, dr_id, p_id } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (dr_id) where.drId = parseInt(dr_id);
    if (p_id) where.pId = parseInt(p_id);

    const { count, rows } = await DoctorProdct.findAndCountAll({
      where,
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name'] },
        { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Doctor products retrieved successfully', {
      assignments: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) }
    });
  } catch (err) { next(err); }
};

export const getDoctorProdctById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await DoctorProdct.findByPk(id, { include: [
      { model: Product, as: 'product', attributes: ['id', 'name'] },
      { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
      { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'updater', attributes: ['id', 'username', 'email'] }
    ]});
    if (!assignment) return notFound(res, 'Assignment not found');
    return success(res, 'Assignment retrieved successfully', { assignment });
  } catch (err) { next(err); }
};

export const createDoctorProdct = async (req, res, next) => {
  try {
    const { p_id, dr_id, quantity, product_note } = req.body;

    const existing = await DoctorProdct.findOne({ where: { pId: p_id, drId: dr_id } });
    if (existing) {
      return conflict(res, 'This product is already assigned to this doctor');
    }

    const assignment = await DoctorProdct.create({
      pId: p_id,
      drId: dr_id,
      quantity: quantity ?? 0,
      productNote: product_note ?? null,
      createdBy: req.user.id
    });

    await assignment.reload({ include: [
      { model: Product, as: 'product', attributes: ['id', 'name'] },
      { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
      { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
    ]});

    return created(res, 'Assignment created successfully', { assignment });
  } catch (err) { next(err); }
};

export const updateDoctorProdct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { p_id, dr_id, quantity, product_note } = req.body;

    const assignment = await DoctorProdct.findByPk(id);
    if (!assignment) return notFound(res, 'Assignment not found');

    if (assignment.createdBy !== req.user.id && !req.userPermissions?.includes('doctorProdct.edit')) return forbidden(res, 'You are not allowed to update this assignment');

    if (p_id !== undefined) assignment.pId = p_id;
    if (dr_id !== undefined) assignment.drId = dr_id;
    if (quantity !== undefined) assignment.quantity = quantity;
    if (product_note !== undefined) assignment.productNote = product_note;
    assignment.updatedBy = req.user.id;

    await assignment.save();
    await assignment.reload({ include: [
      { model: Product, as: 'product', attributes: ['id', 'name'] },
      { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
      { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'updater', attributes: ['id', 'username', 'email'] }
    ]});

    return success(res, 'Assignment updated successfully', { assignment });
  } catch (err) { next(err); }
};

export const deleteDoctorProdct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await DoctorProdct.findByPk(id);
    if (!assignment) return notFound(res, 'Assignment not found');
    if (assignment.createdBy !== req.user.id && !req.userPermissions?.includes('doctorProdct.delete')) return forbidden(res, 'You are not allowed to delete this assignment');
    await assignment.destroy();
    return success(res, 'Assignment deleted successfully');
  } catch (err) { next(err); }
};

export const incrementQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount = 1 } = req.body;

    const assignment = await DoctorProdct.findByPk(id);
    if (!assignment) return notFound(res, 'Assignment not found');

    assignment.quantity = Number(assignment.quantity) + Number(amount);
    assignment.updatedBy = req.user.id;
    await assignment.save();

    return success(res, 'Quantity increased successfully', { assignment });
  } catch (err) { next(err); }
};

export const decrementQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount = 1 } = req.body;

    const assignment = await DoctorProdct.findByPk(id);
    if (!assignment) return notFound(res, 'Assignment not found');

    const newQty = Number(assignment.quantity) - Number(amount);
    assignment.quantity = newQty < 0 ? 0 : newQty;
    assignment.updatedBy = req.user.id;
    await assignment.save();

    return success(res, 'Quantity decreased successfully', { assignment });
  } catch (err) { next(err); }
};
