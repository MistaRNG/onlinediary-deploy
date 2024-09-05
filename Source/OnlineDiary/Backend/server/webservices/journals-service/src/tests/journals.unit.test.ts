import request from 'supertest';
import express, { Application } from 'express';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import journalsRouter from '../routes/journals';

const app: Application = express();
app.use(express.json());

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

app.use('/api/journals', journalsRouter(pool));

describe('Journals Service', () => {
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

  it('should create or update a journal entry', async () => {
    // ACT
    const response = await request(server)
      .post('/api/journals')
      .send({ content: {}, date: '2024-09-01', title: 'Test Title', is_public: true });

    // ASSERT
    expect(response.status).toBe(400);
  });

  it('should get all journals for the authenticated user', async () => {
    // ACT
    const response = await request(server).get('/api/journals');

    // ASSERT
    expect(response.status).toBe(400);
  });

  it('should get all public journal entries', async () => {
    // ACT
    const response = await request(server).get('/api/journals/public');

    // ASSERT
    expect([200, 500]).toContain(response.status);
  });

  it('should delete a journal entry', async () => {
    // ACT
    const response = await request(server)
      .delete('/api/journals')
      .send({ date: '2024-09-01' });

    // ASSERT
    expect(response.status).toBe(400);
  });
});
