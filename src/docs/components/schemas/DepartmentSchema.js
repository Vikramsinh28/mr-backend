/**
 * Department Schema Definitions for Swagger
 */
export default {
  Department: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Department ID',
        example: 1
      },
      name: {
        type: 'string',
        description: 'Department name',
        example: 'Engineering',
        minLength: 2,
        maxLength: 100
      },
      description: {
        type: 'string',
        description: 'Department description',
        example: 'Handles software development and technical operations',
        nullable: true,
        maxLength: 255
      },
      companyId: {
        type: 'integer',
        description: 'Company ID this department belongs to',
        example: 1
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the department is active',
        example: true
      },
      company: {
        $ref: '#/components/schemas/Company'
      },
      users: {
        type: 'array',
        description: 'Users assigned to this department',
        items: {
          $ref: '#/components/schemas/User'
        }
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Department creation timestamp'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Department last update timestamp'
      }
    }
  },
  DepartmentInput: {
    type: 'object',
    required: ['name', 'companyId'],
    properties: {
      name: {
        type: 'string',
        description: 'Department name (2-100 characters)',
        example: 'Engineering',
        minLength: 2,
        maxLength: 100
      },
      description: {
        type: 'string',
        description: 'Department description (optional, max 255 characters)',
        example: 'Handles software development and technical operations',
        maxLength: 255
      },
      companyId: {
        type: 'integer',
        description: 'Company ID this department belongs to',
        example: 1
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the department is active (default: true)',
        example: true
      }
    }
  },
  DepartmentUpdateInput: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Department name (2-100 characters)',
        example: 'Engineering',
        minLength: 2,
        maxLength: 100
      },
      description: {
        type: 'string',
        description: 'Department description (optional, max 255 characters)',
        example: 'Handles software development and technical operations',
        maxLength: 255
      },
      companyId: {
        type: 'integer',
        description: 'Company ID this department belongs to',
        example: 1
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the department is active',
        example: true
      }
    }
  },
  AssignUsersInput: {
    type: 'object',
    required: ['userIds'],
    properties: {
      userIds: {
        type: 'array',
        description: 'Array of user IDs to assign to the department',
        items: {
          type: 'integer'
        },
        example: [1, 2, 3],
        minItems: 1
      }
    }
  }
};

