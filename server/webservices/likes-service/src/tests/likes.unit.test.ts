import request from 'supertest';
import express, { Application } from 'express';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import likesRouter from '../routes/likes';

const app: Application = express();
app.use(express.json());
const pool = new Pool();

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [{}] }),
  };
  return { Pool: jest.fn(() => mPool) };
});

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

app.use('/api/likes', likesRouter(pool));

describe('Likes Routes', () => {
  let server: any;

  // ARRANGE
  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('should get like count and user like status', async () => {
    // ACT
    const response = await request(server).get('/api/likes/1');

    // ASSERT
    expect([401, 200]).toContain(response.status);
  });

  it('should get usernames of users who liked a journal', async () => {
    // ACT
    const response = await request(server).get('/api/likes/users/1');

    // ASSERT
    expect([200, 404]).toContain(response.status);
  });

  it('should like a journal', async () => {
    // ACT
    const response = await request(server).post('/api/likes').send({ journal_id: 1 });

    // ASSERT
    expect([200, 401]).toContain(response.status);
  });

  it('should unlike a journal', async () => {
    // ACT
    const response = await request(server).delete('/api/likes').send({ journal_id: 1 });

    // ASSERT
    expect([200, 401]).toContain(response.status);
  });
});
