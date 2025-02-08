import request from 'supertest';
import express, { Application } from 'express';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import journalsRouter from '../routes/journals';
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
app.use('/api/journals', journalsRouter(pool));

describe('Journals Service Index', () => {
  let server: any;

  // ARRANGE
  beforeEach((done) => {
    server = app.listen(() => done());
  });

  afterEach((done) => {
    server.close(() => {
      pool.end(() => done());
    });
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

  it('should handle journals route', async () => {
    // ACT
    const response = await request(server).get('/api/journals');

    // ASSERT
    expect(response.status).toBe(400);
  });
});
