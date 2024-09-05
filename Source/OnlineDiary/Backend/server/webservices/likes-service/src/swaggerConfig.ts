import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.LIKES_SERVICE_PORT || '3003';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Likes Service API',
      version: '1.0.0',
      description: 'API Documentation for Likes Service',
    },
    tags: [
      {
        name: 'Like Operations',
        description: 'Operations related to liking and unliking posts or journals.',
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}/api/likes`,
        description: 'Local server for Likes API',
      },
    ],
    components: {
      schemas: {
        Like: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The unique identifier of the like.',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'ID of the user who liked the journal.',
              example: 42,
            },
            journal_id: {
              type: 'integer',
              description: 'ID of the journal that was liked.',
              example: 10,
            },
          },
        },
        LikeCount: {
          type: 'object',
          properties: {
            count: {
              type: 'integer',
              description: 'The total number of likes for the journal.',
              example: 15,
            },
            userLiked: {
              type: 'boolean',
              description: 'Indicates whether the authenticated user has liked the journal.',
              example: true,
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Description of the error that occurred.',
              example: 'User not authenticated.',
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
