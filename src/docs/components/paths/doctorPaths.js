export default {
  '/api/doctors': {
    get: {
      summary: 'Get all doctors',
      tags: ['Doctors'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'specialty', schema: { type: 'string' } },
        { in: 'query', name: 'status', schema: { type: 'string', enum: ['active','inactive'] } },
        { in: 'query', name: 'preferred', schema: { type: 'boolean' } }
      ],
      responses: { 200: { description: 'Doctors retrieved successfully' } }
    },
    post: {
      summary: 'Create doctor',
      tags: ['Doctors'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['doctorName'],
              properties: {
                doctorName: { type: 'string' }
              }
            }
          }
        }
      },
      responses: { 201: { description: 'Doctor created successfully' } }
    }
  },
  '/api/doctors/{id}': {
    get: {
      summary: 'Get doctor by ID',
      tags: ['Doctors'],
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Doctor retrieved successfully' }, 404: { $ref: '#/components/responses/NotFoundError' } }
    },
    patch: {
      summary: 'Update doctor',
      tags: ['Doctors'],
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Doctor updated successfully' } }
    },
    delete: {
      summary: 'Delete doctor',
      tags: ['Doctors'],
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      responses: { 200: { description: 'Doctor deleted successfully' } }
    }
  }
};
