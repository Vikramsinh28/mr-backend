export default {
  Doctor: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      doctorName: { type: 'string' },
      specialty: { type: 'string' },
      hospital: { type: 'string' },
      location: { type: 'string' },
      phone: { type: 'string' },
      email: { type: 'string', format: 'email' },
      experienceYears: { type: 'integer' },
      consultationFee: { type: 'number', format: 'decimal' },
      status: { type: 'string', enum: ['active','inactive'] },
      qualification: { type: 'string' },
      availability: { type: 'object' },
      notes: { type: 'string' },
      preferredDoctor: { type: 'boolean' },
      createdBy: { type: 'integer' },
      updatedBy: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      deletedAt: { type: 'string', format: 'date-time' }
    }
  }
};
