import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

jest.mock('axios');

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn().mockReturnValue((req: Request, res: Response, next: NextFunction) => next()),
}));

const app: Application = express();
app.use(express.json());

app.get('/api-docs-json', async (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: { title: 'Onlinediary API Documentation', version: '1.0.0' },
    paths: {},
    components: { schemas: {}, responses: {} },
    tags: [],
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup());
app.use('/comments', createProxyMiddleware({ target: 'http://comments-service:3002', changeOrigin: true }));
app.use('/likes', createProxyMiddleware({ target: 'http://likes-service:3003', changeOrigin: true }));
app.use('/journals', createProxyMiddleware({ target: 'http://journals-service:3005', changeOrigin: true }));
app.use('/mode', createProxyMiddleware({ target: 'http://mode-service:3006', changeOrigin: true }));
app.use('/users', createProxyMiddleware({ target: 'http://users-service:3004', changeOrigin: true }));
app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:3001', changeOrigin: true }));

describe('Gateway Service', () => {
  let server: any;

  beforeEach(() => {
    // ARRANGE
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
    expect(response.body.info).toHaveProperty('title', 'Onlinediary API Documentation');
  });

  it('should proxy requests to the comments service', async () => {
    // ACT
    const response = await request(server).get('/comments');

    // ASSERT
    expect(response.status).toBe(404);
  });

  it('should proxy requests to the likes service', async () => {
    // ACT
    const response = await request(server).get('/likes');

    // ASSERT
    expect(response.status).toBe(404);
  });

  it('should proxy requests to the journals service', async () => {
    // ACT
    const response = await request(server).get('/journals');

    // ASSERT
    expect(response.status).toBe(404);
  });

  it('should proxy requests to the mode service', async () => {
    // ACT
    const response = await request(server).get('/mode');

    // ASSERT
    expect(response.status).toBe(404);
  });

  it('should proxy requests to the users service', async () => {
    // ACT
    const response = await request(server).get('/users');

    // ASSERT
    expect(response.status).toBe(404);
  });

  it('should proxy requests to the auth service', async () => {
    // ACT
    const response = await request(server).get('/auth');

    // ASSERT
    expect(response.status).toBe(404);
  });
});
