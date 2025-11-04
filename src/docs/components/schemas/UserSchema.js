/**
 * User Schema Definitions for Swagger
 */
export default {
    User: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'User ID',
                example: 1
            },
            username: {
                type: 'string',
                description: 'Unique username',
                example: 'johndoe',
                minLength: 3,
                maxLength: 50
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'User email address',
                example: 'john@example.com'
            },
            firstName: {
                type: 'string',
                description: 'User first name',
                example: 'John',
                nullable: true
            },
            lastName: {
                type: 'string',
                description: 'User last name',
                example: 'Doe',
                nullable: true
            },
            isActive: {
                type: 'boolean',
                description: 'Whether the user account is active',
                example: true
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Account creation timestamp'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Account last update timestamp'
            }
        }
    },
    UserInput: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
            username: {
                type: 'string',
                description: 'Unique username (3-50 characters)',
                example: 'johndoe',
                minLength: 3,
                maxLength: 50
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Valid email address',
                example: 'john@example.com'
            },
      password: {
        type: 'string',
        format: 'password',
        description: 'User password (minimum 6 characters)',
        example: 'SecurePass123',
        minLength: 6
      },
            firstName: {
                type: 'string',
                description: 'User first name (optional)',
                example: 'John'
            },
            lastName: {
                type: 'string',
                description: 'User last name (optional)',
                example: 'Doe'
            }
        }
    },
    LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                description: 'Email address or username',
                example: 'john@example.com'
            },
            password: {
                type: 'string',
                format: 'password',
                description: 'User password',
                example: 'SecurePass123!'
            }
        }
    },
    AuthResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true
            },
            message: {
                type: 'string',
                example: 'Login successful'
            },
            data: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        description: 'JWT authentication token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    },
                    user: {
                        $ref: '#/components/schemas/User'
                    }
                }
            }
        }
    },
    ErrorResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: false
            },
            message: {
                type: 'string',
                example: 'Error message description'
            },
            details: {
                type: 'object',
                description: 'Optional error details/context',
                additionalProperties: true,
                properties: {
                    errors: {
                        type: 'array',
                        description: 'Array of validation errors',
                        items: {
                            type: 'object',
                            properties: {
                                field: {
                                    type: 'string',
                                    example: 'email'
                                },
                                message: {
                                    type: 'string',
                                    example: 'Invalid email format'
                                },
                                value: {
                                    type: 'string',
                                    example: 'invalid-email'
                                },
                                location: {
                                    type: 'string',
                                    example: 'body'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};