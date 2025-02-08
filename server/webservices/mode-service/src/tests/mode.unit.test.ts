import request from 'supertest';
import express, { Application } from 'express';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import session from 'express-session';
import modeRouter from '../routes/mode';

const app: Application = express();
app.use(express.json());

app.use(
  session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use('/api/mode', modeRouter());

describe('Mode Service', () => {
  let server: any;

  // ARRANGE
  beforeEach((done) => {
    server = app.listen(() => done());
  });

  afterEach((done) => {
    server.close(() => done());
  });

  it('should get the current dark mode setting', async () => {
    // ACT
    const response = await request(server).get('/api/mode');

    // ASSERT
    expect(response.status).toBe(200);
    expect([true, false]).toContain(response.body);
  });

  it('should toggle the dark mode setting', async () => {
    // ARRANGE
    await request(server).post('/api/mode').send({ darkMode: false });

    // ACT
    const response = await request(server).post('/api/mode').send({ darkMode: false });

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});
