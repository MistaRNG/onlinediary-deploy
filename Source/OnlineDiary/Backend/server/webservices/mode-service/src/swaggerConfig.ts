import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.MODE_SERVICE_PORT || '3006';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mode Service API',
      version: '1.0.0',
      description: 'API Documentation for Mode Service',
    },
    tags: [
      {
        name: 'Interface Mode Settings',
        description: 'Operations related to user interface mode settings, like dark mode toggling.',
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}/api/mode`,
        description: 'Local server for Mode API',
      },
    ],
    components: {
      schemas: {
        ModeToggleRequest: {
          type: 'object',
          properties: {
            darkMode: {
              type: 'boolean',
              description: 'Current state of dark mode setting. Pass `true` to toggle to light mode, and vice versa.',
              example: true,
            },
          },
        },
        ModeResponse: {
          type: 'boolean',
          description: 'The updated state of the dark mode setting after the toggle.',
          example: false,
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Description of the error that occurred.',
              example: 'Session not found.',
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
