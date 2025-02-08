import swaggerJSDoc from 'swagger-jsdoc';

const PORT = process.env.JOURNALS_SERVICE_PORT || '3005';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Journals Service API',
      version: '1.0.0',
      description: 'API Documentation for managing journal entries.',
    },
    tags: [
      {
        name: 'Journal Entries Management',
        description: 'Operations related to journal entries, including creating, updating, and fetching journals.',
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        JournalEntry: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The unique identifier of the journal entry.',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'ID of the user who created the journal entry.',
              example: 42,
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'The date of the journal entry.',
              example: '2024-09-05',
            },
            title: {
              type: 'string',
              description: 'The title of the journal entry.',
              example: 'My First Journal Entry',
            },
            content: {
              type: 'object',
              description: 'The content of the journal entry, usually a complex structure.',
              example: { text: 'Today I learned how to use Swagger!' },
            },
            is_public: {
              type: 'boolean',
              description: 'Indicates whether the journal entry is public.',
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
              example: 'User ID is required.',
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
