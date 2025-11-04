/**
 * Role Schema Definitions for Swagger
 */
export default {
  Role: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Role ID',
        example: 1
      },
      name: {
        type: 'string',
        description: 'Unique role name',
        example: 'admin',
        minLength: 2,
        maxLength: 50
      },
      description: {
        type: 'string',
        description: 'Role description',
        example: 'Full system access with all permissions',
        nullable: true
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the role is active',
        example: true
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Role creation timestamp'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Role last update timestamp'
      }
    }
  },
  RoleInput: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Unique role name (2-50 characters)',
        example: 'editor',
        minLength: 2,
        maxLength: 50
      },
      description: {
        type: 'string',
        description: 'Role description (optional)',
        example: 'Can create, read, and update content'
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the role is active (default: true)',
        example: true
      }
    }
  }
};

