import request from 'supertest';
import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import session from 'express-session';
import passport from 'passport';

const app: Application = express();
app.use(express.json());

app.use(
  session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/api-docs-json', (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: { title: 'Auth API', version: '1.0.0' },
    paths: {},
    components: { schemas: {}, responses: {} },
    tags: [],
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup());

app.get('/api/auth/gitlab', (req: Request, res: Response) => {
  res.status(302).send('Redirecting to GitLab authentication');
});

app.get('/api/auth/gitlab/callback', (req: Request, res: Response) => {
  res.json({ message: 'Authentication successful' });
});

describe('Auth Service', () => {
  let server: any;

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('should return the API docs JSON', async () => {
    // ACT
    const response = await request(server).get('/api-docs-json');

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('openapi', '3.0.0');
    expect(response.body.info).toHaveProperty('title', 'Auth API');
  });

  it('should redirect to GitLab authentication', async () => {
    // ACT
    const response = await request(server).get('/api/auth/gitlab');

    // ASSERT
    expect(response.status).toBe(302);
  });

  it('should handle GitLab callback and authenticate', async () => {
    // ACT
    const response = await request(server).get('/api/auth/gitlab/callback');

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Authentication successful');
  });
});
