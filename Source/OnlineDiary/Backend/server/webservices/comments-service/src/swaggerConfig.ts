import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.COMMENTS_SERVICE_PORT || '3002';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comments Service API',
      version: '1.0.0',
      description: 'API Documentation for Comments Service',
    },
    tags: [
      {
        name: 'Comment Management',
        description: 'Operations related to managing comments on posts or journals.',
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}/api/comments`,
        description: 'Local server for Comments API',
      },
    ],
    components: {
      schemas: {
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the comment.',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'ID of the user who created the comment.',
              example: 10,
            },
            journal_id: {
              type: 'integer',
              description: 'ID of the journal the comment belongs to.',
              example: 5,
            },
            content: {
              type: 'string',
              description: 'The content of the comment.',
              example: 'This is a sample comment.',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp when the comment was created.',
              example: '2023-09-04T12:34:56Z',
            },
            username: {
              type: 'string',
              description: 'The username of the user who created the comment.',
              example: 'john_doe',
            },
          },
        },
        NewComment: {
          type: 'object',
          properties: {
            journal_id: {
              type: 'integer',
              description: 'ID of the journal the comment is being added to.',
              example: 5,
            },
            content: {
              type: 'string',
              description: 'Content of the new comment.',
              example: 'This is a new comment.',
            },
          },
          required: ['journal_id', 'content'],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
