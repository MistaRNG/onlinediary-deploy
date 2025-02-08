import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import commentsRouter from './routes/comments';
import db from './database/db';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

const PgSessionStore = pgSession(session);

app.get('/api-docs-json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  session({
    store: new PgSessionStore({
      pool: db,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      domain: 'localhost',
    },
  })
);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/comments', commentsRouter(db));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Comments Service listening on port ${PORT}`);
});
