import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Forum Backend Api',
      version: '1.0.0',
      description: 'A comprehensive backend documentation for understanding different routes and models used!',
      contact: {
        name: 'Akshay kumar',
        email: 'akshay.1904@gmail.com',
        url: 'https://github.com/akshay.1904kumar'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Devlopment Server!'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token(Without Bearer prefix )',
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email'],
          properties: {
            _id: {
              type: 'string',
              examples: '507f1f77bcf86cd799439011',
              description: 'MongoDB object'
            },
            username: {
              type: 'string',
              example: 'akshay',
              minLength: 3,
              maxLength: 30
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'akshay.dev@gmail.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        Post: {
          type: 'object',
          required: ['title', 'content', 'author'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              example: 'My post',
              minLength: 1,
              maxLength: 200
            },
            content: {
              type: 'string',
              example: 'This is content related to my post'
            },
            author: {
              $ref: '#/components/schemas/User'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['nodejs', 'javascript', 'backend']
            },
            likes: {
              type: 'number',
              example: 40
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        Comment: {
          type: 'object',
          required: ['content', 'author', 'post'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            content: {
              type: 'string',
              example: 'Comment on the post',
              minLength: 1,
              maxLength: 1000
            },
            author: {
              $ref: '#/components/comment'
            },
            post: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
              description: 'Reference to the Post ID'
            },
            likes: {
              type: 'number',
              example: 5
            },
            createdAt: {
              type: 'string',
              example: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: {
              type: 'string',
              example: 'akshay_dev',
              minLength: 3,
              maxLength: 30
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'akshay.dev@gmail.com'
            },
            password: {
              type: 'string',
              example: 'SecurePassword123',
              minLength: 8,
              maxLength: 128
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'akshay.dev@gmail.com'
            },
            password: {
              type: 'string',
              example: 'SecurePassword123'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'operation successfull'
            },
            data: {
              type: 'object',
              description: 'Response data varies by endpoint'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'an error occurred'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    example: 'Please provide a valid email'
                  },
                  value: {
                    type: 'string',
                    example: 'invalid-email'
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            error: {
              type: 'string',
              example: 'Detailed error message'
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ],
    },
     tags: [
      {
        name: 'Authentication',
        description: 'User registration, login, and authentication endpoints'
      },
      {
        name: 'Posts',
        description: 'Forum posts management'
      },
      {
        name: 'Comments',
        description: 'Comments on posts'
      },
      {
        name: 'Users',
        description: 'User profile and management'
      }
    ]
  },
  apis: ['./Routes/*.js']
}

const specs = swaggerJsdoc(options);
export {
  specs,
  swaggerUi
}