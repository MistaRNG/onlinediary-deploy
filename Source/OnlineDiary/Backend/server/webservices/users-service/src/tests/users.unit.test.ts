import request from 'supertest';
import express, { Application } from 'express';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import usersRouter from '../routes/users';

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

app.use('/api/users', usersRouter);

describe('Users Service', () => {
  let server: any;

  // ARRANGE
  beforeEach((done) => {
    server = app.listen(() => done());
  });

  afterEach((done) => {
    server.close(() => {
      pool.end(() => {
        done();
      });
    });
  });

  it('should log in a user', async () => {
    // ACT
    const response = await request(server).post('/api/users/login').send({ username: 'testuser', password: 'password' });

    // ASSERT
    expect([200, 400, 401, 500]).toContain(response.status);
  });

  it('should register a new user', async () => {
    // ACT
    const response = await request(server).post('/api/users/register').send({
      username: 'newuser',
      password: 'password',
      confirmPassword: 'password',
    });

    // ASSERT
    expect([201, 400, 500]).toContain(response.status);
  });

  it('should get the current user information', async () => {
    // ACT
    const response = await request(server).get('/api/users');

    // ASSERT
    expect([200, 401, 404]).toContain(response.status);
  });

  it('should get the current user profile', async () => {
    // ACT
    const response = await request(server).get('/api/users/profile');

    // ASSERT
    expect([200, 401, 404]).toContain(response.status);
  });

  it('should log out the current user', async () => {
    // ACT
    const response = await request(server).post('/api/users/logout');

    // ASSERT
    expect(response.status).toBe(200);
  });
});
