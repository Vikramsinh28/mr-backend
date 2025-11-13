export default {
  Expense: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      expenseType: { type: 'string' },
      amount: { type: 'number', format: 'decimal' },
      date: { type: 'string', format: 'date' },
      description: { type: 'string' },
      receiptUrl: { type: 'string', format: 'uri' },
      approved: { type: 'boolean' },
      createdBy: { type: 'integer' },
      updatedBy: { type: 'integer' },
      approvedBy: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      deletedAt: { type: 'string', format: 'date-time' }
    }
  }
};
