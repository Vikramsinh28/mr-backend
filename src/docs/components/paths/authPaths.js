/**
 * Authentication API Paths for Swagger
 */
export default {
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description: 'Creates a new user account with the provided credentials. Password is automatically hashed before storage.',
      operationId: 'registerUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserInput'
            },
            examples: {
              basic: {
                summary: 'Basic registration',
                value: {
                  username: 'johndoe',
                  email: 'john@example.com',
                  password: 'SecurePass123!',
                  firstName: 'John',
                  lastName: 'Doe'
                }
              },
              minimal: {
                summary: 'Minimal registration (required fields only)',
                value: {
                  username: 'janedoe',
                  email: 'jane@example.com',
                  password: 'SecurePass123!'
                }
              }
            }
          }
        }
      },
      responses: {
        '201': {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              },
              example: {
                success: true,
                message: 'User registered successfully',
                data: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  user: {
                    id: 2,
                    username: 'johndoe',
                    email: 'john@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    isActive: true,
                    createdAt: '2024-12-01T10:00:00.000Z',
                    updatedAt: '2024-12-01T10:00:00.000Z'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Missing required fields or validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: 'Missing required fields: username, email, and password are required'
              }
            }
          }
        },
        '409': {
          description: 'User already exists (email or username taken)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: 'User with this email already exists'
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login user and get JWT token',
      description: 'Authenticates a user with email/username and password, returns a JWT token for accessing protected endpoints.',
      operationId: 'loginUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginInput'
            },
            examples: {
              email: {
                summary: 'Login with email',
                value: {
                  email: 'john@example.com',
                  password: 'SecurePass123!'
                }
              },
              username: {
                summary: 'Login with username',
                value: {
                  email: 'johndoe',
                  password: 'SecurePass123!'
                }
              }
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              },
              example: {
                success: true,
                message: 'Login successful',
                data: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  user: {
                    id: 1,
                    username: 'johndoe',
                    email: 'john@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    isActive: true,
                    createdAt: '2024-12-01T10:00:00.000Z',
                    updatedAt: '2024-12-01T10:00:00.000Z'
                  }
                }
              }
            }
          }
        },
        '400': {
          description: 'Missing required fields',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: 'Email and password are required'
              }
            }
          }
        },
        '401': {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: 'Invalid email or password'
              }
            }
          }
        },
        '403': {
          description: 'Account is inactive',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                error: 'Account is inactive. Please contact administrator'
              }
            }
          }
        },
        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get current authenticated user',
      description: 'Returns the currently authenticated user based on the JWT token in the Authorization header.',
      operationId: 'getCurrentUser',
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        '200': {
          description: 'User information retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  data: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              },
              example: {
                success: true,
                data: {
                  user: {
                    id: 1,
                    username: 'johndoe',
                    email: 'john@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    isActive: true,
                    createdAt: '2024-12-01T10:00:00.000Z',
                    updatedAt: '2024-12-01T10:00:00.000Z'
                  }
                }
              }
            }
          }
        },
        '401': {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              examples: {
                noToken: {
                  summary: 'No token provided',
                  value: {
                    success: false,
                    error: 'No token provided. Please provide a valid authentication token.'
                  }
                },
                expiredToken: {
                  summary: 'Token expired',
                  value: {
                    success: false,
                    error: 'Token has expired. Please login again.'
                  }
                },
                invalidToken: {
                  summary: 'Invalid token',
                  value: {
                    success: false,
                    error: 'Invalid token. Please login again.'
                  }
                }
              }
            }
          }
        },
        '403': {
          description: 'Account is inactive',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  }
};

