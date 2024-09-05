import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.USERS_SERVICE_PORT || '3004';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users Service API',
      version: '1.0.0',
      description: 'API Documentation for Users Service',
    },
    tags: [
      {
        name: 'User Management',
        description: 'Operations related to user management, including registration, login, and profile updates.',
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}/api/users`,
        description: 'Local server for Users API',
      },
    ],
    components: {
      schemas: {
        LoginRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user.',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'The password of the user.',
              example: 'securePassword123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username of the new user.',
              example: 'jane_doe',
            },
            password: {
              type: 'string',
              description: 'The password of the new user.',
              example: 'securePassword123',
            },
            confirmPassword: {
              type: 'string',
              description: 'Password confirmation.',
              example: 'securePassword123',
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'A response message indicating the operation result.',
              example: 'Successfully registered',
            },
            username: {
              type: 'string',
              description: 'The username of the user.',
              example: 'john_doe',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Description of the error that occurred.',
              example: 'Invalid login credentials',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
