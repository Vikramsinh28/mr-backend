import { Expense } from '../models/index.js';

export async function create(data) {
  return Expense.create(data);
}

export async function findById(id) {
  return Expense.findByPk(id);
}

export async function updateById(id, updates) {
  const expense = await Expense.findByPk(id);
  if (!expense) return null;
  return expense.update(updates);
}

export async function deleteById(id) {
  const expense = await Expense.findByPk(id);
  if (!expense) return null;
  await expense.destroy();
  return true;
}
