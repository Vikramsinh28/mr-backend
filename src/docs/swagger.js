// Swagger configuration - imports all schemas and paths
import swaggerJsdoc from 'swagger-jsdoc';
import {
  fileURLToPath
} from 'url';
import {
  dirname,
  join
} from 'path';

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = dirname(__filename);

// Import all schemas
import UserSchema from './components/schemas/UserSchema.js';
import RoleSchema from './components/schemas/RoleSchema.js';
import PermissionSchema from './components/schemas/PermissionSchema.js';
import DepartmentSchema from './components/schemas/DepartmentSchema.js';

// Import all paths
import authPaths from './components/paths/authPaths.js';

/**
 * Swagger OpenAPI 3.0 Configuration
 * Dynamically loads all schemas and paths from components folder
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js RBAC CRM API',
    version: '1.0.0',
    description: 'Comprehensive API documentation for the Node.js RBAC (Role-Based Access Control) CRM system. This API provides authentication, user management, role management, and permission management capabilities.',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [{
      url: process.env.API_URL || 'http://localhost:3000',
      description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Local Development Server'
    },
    {
      url: 'http://localhost:3000',
      description: 'Local Server (default)'
    }
  ],
  tags: [{
      name: 'Auth',
      description: 'Authentication endpoints - Register, login, and get current user'
    },
    {
      name: 'Users',
      description: 'User management endpoints - CRUD operations for users'
    },
    {
      name: 'Roles',
      description: 'Role management endpoints - Create, read, update, and delete roles'
    },
    {
      name: 'Permissions',
      description: 'Permission management endpoints - Manage system permissions'
    },
    {
      name: 'Companies',
      description: 'Company management endpoints - CRUD operations for companies'
    },
    {
      name: 'Departments',
      description: 'Department management endpoints - CRUD operations for departments and user assignments'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>'
      }
    },
    schemas: {},
    responses: {
      UnauthorizedError: {
        description: 'Authentication required or token is invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    }
  },
  paths: {}
};

// Merge all schemas
Object.assign(swaggerDefinition.components.schemas, UserSchema);
Object.assign(swaggerDefinition.components.schemas, RoleSchema);
Object.assign(swaggerDefinition.components.schemas, PermissionSchema);
Object.assign(swaggerDefinition.components.schemas, DepartmentSchema);

// Merge paths from components folder (authPaths)
if (authPaths && Object.keys(authPaths).length > 0) {
  Object.assign(swaggerDefinition.paths, authPaths);
}

// Configure swagger-jsdoc to scan route files
// __dirname is src/docs, so we need to go up one level to src, then into routes
const routesPath = join(__dirname, '../routes/**/*.js');
const controllersPath = join(__dirname, '../controllers/**/*.js');

const options = {
  definition: swaggerDefinition,
  apis: [
    routesPath, // Scan all route files
    controllersPath // Scan controller files too
  ],
};

// Generate Swagger specification from JSDoc comments
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;