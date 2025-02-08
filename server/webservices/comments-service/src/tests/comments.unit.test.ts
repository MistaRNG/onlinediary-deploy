import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';
import session, { Session, SessionData } from 'express-session';
import commentsRouter from '../routes/comments';

const mockDb = {
  query: jest.fn(),
};

const createTestApp = (sessionMiddleware?: express.RequestHandler) => {
  const app: Application = express();
  app.use(express.json());

  app.use(
    session({
      secret: 'test_secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, sameSite: 'lax', domain: 'localhost' },
    })
  );

  if (sessionMiddleware) {
    app.use(sessionMiddleware);
  }

  app.use('/api/comments', commentsRouter(mockDb));
  return app;
};

const createMockSessionMiddleware = (user_id: number) => {
  return (req: Request & { session: Session & Partial<SessionData> }, res: Response, next: NextFunction) => {
    req.session.user_id = user_id;
    next();
  };
};

describe('Comments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new comment', async () => {
    // Arrange
    const mockComment = { id: 1, user_id: 1, journal_id: 1, content: 'Test comment' };
    mockDb.query.mockResolvedValueOnce({ rows: [mockComment] });

    const app = createTestApp(createMockSessionMiddleware(1));

    // Act
    const response = await request(app)
      .post('/api/comments')
      .send({ journal_id: 1, content: 'Test comment' });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComment);
  });

  it('should handle missing user ID', async () => {
    const app = createTestApp();

    app.use((req: Request & { session: Session & Partial<SessionData> }, res: Response, next: NextFunction) => {
      req.session = {} as Session & Partial<SessionData>;
      next();
    });

    const response = await request(app).post('/api/comments').send({ journal_id: 1, content: 'Test comment' });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'User ID is required.' });
  });

  it('should return an empty array if no comments found', async () => {
    // Arrange
    mockDb.query.mockResolvedValueOnce({ rows: [] });

    const app = createTestApp();

    // Act
    const response = await request(app).get('/api/comments/1');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
