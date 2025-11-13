import { Op } from 'sequelize';
import { VisitPlanning, CompleteVisit, User, Doctor } from '../models/index.js';
import { success, created, notFound, forbidden, conflict } from '../utils/response.js';

// ========== VISIT PLANNING ==========
export const listVisitPlannings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, city, fromDate, toDate } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { city: { [Op.iLike]: `%${search}%` } },
        { purposeOfVisit: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (city) where.city = { [Op.iLike]: city };
    if (fromDate || toDate) {
      where.visitDate = {};
      if (fromDate) where.visitDate[Op.gte] = fromDate;
      if (toDate) where.visitDate[Op.lte] = toDate;
    }

    const { count, rows } = await VisitPlanning.findAndCountAll({
      where,
      include: [ { model: User, as: 'creator', attributes: ['id', 'username', 'email'] } ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['visitDate', 'DESC'], ['createdAt', 'DESC']]
    });

    return success(res, 'Visit planning retrieved successfully', {
      visits: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) }
    });
  } catch (err) { next(err); }
};

export const getVisitPlanningById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await VisitPlanning.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'updater', attributes: ['id', 'username', 'email'] }
      ]
    });
    if (!visit) return notFound(res, 'Visit planning not found');
    return success(res, 'Visit planning retrieved successfully', { visit });
  } catch (err) { next(err); }
};

export const createVisitPlanning = async (req, res, next) => {
  try {
    const { city, purpose_of_visit, notes, visit_date, purposeOfVisit, visitDate } = req.body;

    const visit = await VisitPlanning.create({
      city,
      purposeOfVisit: purpose_of_visit ?? purposeOfVisit ?? null,
      notes: notes ?? null,
      visitDate: visit_date ?? visitDate,
      createdBy: req.user.id
    });

    await visit.reload({ include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'email'] }] });
    return created(res, 'Visit planning created successfully', { visit });
  } catch (err) { next(err); }
};

export const updateVisitPlanning = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await VisitPlanning.findByPk(id);
    if (!visit) return notFound(res, 'Visit planning not found');

    if (visit.createdBy !== req.user.id && !req.userPermissions?.includes('visitPlanning.edit')) {
      return forbidden(res, 'You are not allowed to update this record');
    }

    const { city, purpose_of_visit, purposeOfVisit, notes, visit_date, visitDate } = req.body;
    if (city !== undefined) visit.city = city;
    if (purpose_of_visit !== undefined || purposeOfVisit !== undefined) visit.purposeOfVisit = purpose_of_visit ?? purposeOfVisit;
    if (notes !== undefined) visit.notes = notes;
    if (visit_date !== undefined || visitDate !== undefined) visit.visitDate = visit_date ?? visitDate;
    visit.updatedBy = req.user.id;

    await visit.save();
    await visit.reload({ include: [ { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }, { model: User, as: 'updater', attributes: ['id', 'username', 'email'] } ] });
    return success(res, 'Visit planning updated successfully', { visit });
  } catch (err) { next(err); }
};

export const deleteVisitPlanning = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await VisitPlanning.findByPk(id);
    if (!visit) return notFound(res, 'Visit planning not found');

    if (visit.createdBy !== req.user.id && !req.userPermissions?.includes('visitPlanning.delete')) {
      return forbidden(res, 'You are not allowed to delete this record');
    }

    await visit.destroy();
    return success(res, 'Visit planning deleted successfully');
  } catch (err) { next(err); }
};

// ========== COMPLETE VISIT ==========
export const listCompleteVisits = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, dr_id, visit_planning_id } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (dr_id) where.drId = parseInt(dr_id);
    if (visit_planning_id) where.visitPlanningId = parseInt(visit_planning_id);

    const { count, rows } = await CompleteVisit.findAndCountAll({
      where,
      include: [
        { model: VisitPlanning, as: 'visitPlanning' },
        { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return success(res, 'Complete visits retrieved successfully', {
      visits: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) }
    });
  } catch (err) { next(err); }
};

export const getCompleteVisitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await CompleteVisit.findByPk(id, {
      include: [
        { model: VisitPlanning, as: 'visitPlanning' },
        { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'updater', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'visitor', attributes: ['id', 'username', 'email'] }
      ]
    });
    if (!visit) return notFound(res, 'Complete visit not found');
    return success(res, 'Complete visit retrieved successfully', { visit });
  } catch (err) { next(err); }
};

export const createCompleteVisit = async (req, res, next) => {
  try {
    const { dr_id, visit_planning_id, visited_by } = req.body;

    const visit = await CompleteVisit.create({
      drId: dr_id,
      visitPlanningId: visit_planning_id,
      visitedBy: visited_by ?? req.user.id,
      createdBy: req.user.id
    });

    await visit.reload({ include: [
      { model: VisitPlanning, as: 'visitPlanning' },
      { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
      { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
    ]});

    return created(res, 'Complete visit created successfully', { visit });
  } catch (err) { next(err); }
};

export const updateCompleteVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await CompleteVisit.findByPk(id);
    if (!visit) return notFound(res, 'Complete visit not found');

    if (visit.createdBy !== req.user.id && !req.userPermissions?.includes('completeVisit.edit')) {
      return forbidden(res, 'You are not allowed to update this record');
    }

    const { dr_id, visit_planning_id, visited_by } = req.body;
    if (dr_id !== undefined) visit.drId = dr_id;
    if (visit_planning_id !== undefined) visit.visitPlanningId = visit_planning_id;
    if (visited_by !== undefined) visit.visitedBy = visited_by;
    visit.updatedBy = req.user.id;

    await visit.save();
    await visit.reload({ include: [
      { model: VisitPlanning, as: 'visitPlanning' },
      { model: Doctor, as: 'doctor', attributes: ['id', 'doctorName'] },
      { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'updater', attributes: ['id', 'username', 'email'] },
      { model: User, as: 'visitor', attributes: ['id', 'username', 'email'] }
    ]});

    return success(res, 'Complete visit updated successfully', { visit });
  } catch (err) { next(err); }
};

export const deleteCompleteVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await CompleteVisit.findByPk(id);
    if (!visit) return notFound(res, 'Complete visit not found');

    if (visit.createdBy !== req.user.id && !req.userPermissions?.includes('completeVisit.delete')) {
      return forbidden(res, 'You are not allowed to delete this record');
    }

    await visit.destroy();
    return success(res, 'Complete visit deleted successfully');
  } catch (err) { next(err); }
};
