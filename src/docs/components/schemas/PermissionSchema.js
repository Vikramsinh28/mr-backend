/**
 * Permission Schema Definitions for Swagger
 */
export default {
  Permission: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Permission ID',
        example: 1
      },
      name: {
        type: 'string',
        description: 'Unique permission name (format: resource.action)',
        example: 'user.create',
        minLength: 2,
        maxLength: 100
      },
      description: {
        type: 'string',
        description: 'Permission description',
        example: 'Create new users',
        nullable: true
      },
      resource: {
        type: 'string',
        description: 'Resource type (e.g., "user", "role", "order")',
        example: 'user',
        nullable: true
      },
      action: {
        type: 'string',
        description: 'Action type (e.g., "create", "read", "update", "delete")',
        example: 'create',
        nullable: true
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Permission creation timestamp'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Permission last update timestamp'
      }
    }
  },
  PermissionInput: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Unique permission name (2-100 characters)',
        example: 'order.delete',
        minLength: 2,
        maxLength: 100
      },
      description: {
        type: 'string',
        description: 'Permission description (optional)',
        example: 'Delete orders'
      },
      resource: {
        type: 'string',
        description: 'Resource type (optional)',
        example: 'order'
      },
      action: {
        type: 'string',
        description: 'Action type (optional)',
        example: 'delete'
      }
    }
  }
};

