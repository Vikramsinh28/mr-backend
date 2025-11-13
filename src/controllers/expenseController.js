import { Op } from 'sequelize';
import { Expense, User } from '../models/index.js';
import { success, created, notFound, error as errorResponse, forbidden } from '../utils/response.js';

// List expenses with pagination and filters (user-level)
export const listExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, fromDate, toDate, approved, type, period } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    // Search by type/description (fuzzy)
    if (search) {
      where[Op.or] = [
        { expenseType: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by Type (case-insensitive exact match)
    if (type) {
      where.expenseType = { [Op.iLike]: type };
    }

    // Date range priority: explicit fromDate/toDate > period shortcut
    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date[Op.gte] = fromDate;
      if (toDate) where.date[Op.lte] = toDate;
    } else if (period) {
      const norm = String(period).toLowerCase().replace(/\s+/g, '_');
      const toISO = (d) => d.toISOString().slice(0, 10);
      const today = new Date();
      let start = null;
      let end = null;

      if (norm === 'today') {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        start = toISO(d); end = toISO(d);
      } else if (norm === 'yesterday') {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        start = toISO(d); end = toISO(d);
      } else if (norm === 'this_week' || norm === 'week') {
        // ISO week starting Monday
        const dow = today.getDay(); // 0=Sun..6=Sat
        const mondayOffset = ((dow + 6) % 7);
        const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);
        const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
        start = toISO(monday); end = toISO(sunday);
      } else if (norm === 'this_month' || norm === 'month') {
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        start = toISO(first); end = toISO(last);
      } else if (norm === 'all' || norm === 'all_time' || norm === 'alltime') {
        // no date filter
      }

      if (start && end) {
        where.date = { [Op.between]: [start, end] };
      }
    }

    // Approved filter
    if (approved !== undefined) {
      if (approved === 'true' || approved === true) where.approved = true;
      if (approved === 'false' || approved === false) where.approved = false;
    }

    const { count, rows } = await Expense.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    return success(res, 'Expenses retrieved successfully', {
      expenses: rows,
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

// Get single expense
export const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] }
      ]
    });

    if (!expense) return notFound(res, 'Expense not found');

    return success(res, 'Expense retrieved successfully', { expense });
  } catch (err) {
    next(err);
  }
}

// Create expense
export const createExpense = async (req, res, next) => {
  try {
    const { expenseType, amount, date, description, receiptUrl } = req.body;

    const expense = await Expense.create({
      expenseType,
      amount,
      date,
      description,
      receiptUrl: receiptUrl || null,
      createdBy: req.user.id,
      approved: false
    });

    await expense.reload({
      include: [{ model: User, as: 'creator', attributes: ['id', 'username', 'email'] }]
    });

    return created(res, 'Expense created successfully', { expense });
  } catch (err) {
    next(err);
  }
}

// Update expense (only creator can update if not approved)
export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expenseType, amount, date, description, receiptUrl } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) return notFound(res, 'Expense not found');

    if (expense.approved) {
      return forbidden(res, 'Approved expense cannot be edited');
    }

    if (expense.createdBy !== req.user.id) {
      return forbidden(res, 'You can only edit your own expenses');
    }

    if (expenseType !== undefined) expense.expenseType = expenseType;
    if (amount !== undefined) expense.amount = amount;
    if (date !== undefined) expense.date = date;
    if (description !== undefined) expense.description = description;
    if (receiptUrl !== undefined) expense.receiptUrl = receiptUrl;
    expense.updatedBy = req.user.id;

    await expense.save();

    await expense.reload({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] }
      ]
    });

    return success(res, 'Expense updated successfully', { expense });
  } catch (err) {
    next(err);
  }
}

// Delete expense (soft delete via paranoid)
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) return notFound(res, 'Expense not found');

    if (expense.createdBy !== req.user.id && !req.userPermissions?.includes('expense.delete')) {
      return forbidden(res, 'You are not allowed to delete this expense');
    }

    await expense.destroy();

    return success(res, 'Expense deleted successfully');
  } catch (err) {
    next(err);
  }
}

// Approve expense
export const approveExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) return notFound(res, 'Expense not found');

    if (expense.approved) {
      return success(res, 'Expense already approved', { expense });
    }

    expense.approved = true;
    expense.approvedBy = req.user.id;
    expense.updatedBy = req.user.id;

    await expense.save();

    await expense.reload({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'approver', attributes: ['id', 'username', 'email'] }
      ]
    });

    return success(res, 'Expense approved successfully', { expense });
  } catch (err) {
    next(err);
  }
}
