import request from 'supertest';
import express, { Application } from 'express';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import commentsRouter from '../routes/comments';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swaggerConfig';

const app: Application = express();
const pool = new Pool();

app.use(
  session({
    store: new (pgSession(session))({
      pool: pool,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    secret: 'test_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.get('/api-docs-json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/comments', commentsRouter(pool));

describe('Comments Service Index', () => {
  let server: any;

  beforeEach(() => {
    // ARRANGE
    server = app.listen();
  });

  afterEach(() => {
    // CLEAN UP
    server.close();
  });

  it('should serve the API docs JSON', async () => {
    // ACT
    const response = await request(server).get('/api-docs-json');

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('openapi', '3.0.0');
  });

  it('should serve the API docs UI', async () => {
    // ACT
    const response = await request(server).get('/api-docs');

    // ASSERT
    expect([200, 301]).toContain(response.status);
  });

  it('should handle comments route', async () => {
    // ACT
    const response = await request(server).get('/api/comments');

    // ASSERT
    expect([200, 400, 404]).toContain(response.status);
  });
});
