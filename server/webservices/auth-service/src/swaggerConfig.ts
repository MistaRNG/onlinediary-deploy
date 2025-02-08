import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.AUTH_SERVICE_PORT || '3001';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'API Documentation for Auth Service',
    },
    tags: [
      {
        name: 'Authentication and Authorization',
        description: 'Operations related to user authentication, including login, registration, and OAuth.',
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}/api/auth`,
        description: 'Local server for Auth API',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the user.',
              example: 1,
            },
            username: {
              type: 'string',
              description: 'Username of the user.',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'Password of the user (hashed).',
              example: '$2a$10$EIXIS4ABjIBdZJX/rBzHDe6pkP4XZ.jUe6GpaA.zcW9AexRhQ2K9S',
            },
          },
        },
        GitLabProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'GitLab profile ID.',
              example: '123456',
            },
            username: {
              type: 'string',
              description: 'GitLab username.',
              example: 'gitlabuser',
            },
            email: {
              type: 'string',
              description: 'Email address of the GitLab user.',
              example: 'user@gitlab.com',
            },
          },
        },
      },
    },
  },
  apis: ['./src/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
