export default {
  '/api/expenses': {
    get: {
      summary: 'Get all expenses',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'fromDate', schema: { type: 'string', format: 'date' } },
        { in: 'query', name: 'toDate', schema: { type: 'string', format: 'date' } },
        { in: 'query', name: 'approved', schema: { type: 'boolean' } }
      ],
      responses: { 200: { description: 'Expenses retrieved successfully' } }
    },
    post: {
      summary: 'Create expense',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['expenseType', 'amount', 'date'],
              properties: {
                expenseType: { type: 'string' },
                amount: { type: 'number' },
                date: { type: 'string', format: 'date' },
                description: { type: 'string' },
                receiptUrl: { type: 'string', format: 'uri' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Expense created successfully' } }
    }
  },
  '/api/expenses/{id}': {
    get: {
      summary: 'Get expense by ID',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Expense retrieved successfully' }, 404: { $ref: '#/components/responses/NotFoundError' } }
    },
    patch: {
      summary: 'Update expense',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      requestBody: {
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Expense' } } }
      },
      responses: { 200: { description: 'Expense updated successfully' } }
    },
    delete: {
      summary: 'Delete expense',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Expense deleted successfully' } }
    }
  },
  '/api/expenses/{id}/approve': {
    post: {
      summary: 'Approve expense',
      tags: ['Expenses'],
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Expense approved successfully' } }
    }
  }
};
