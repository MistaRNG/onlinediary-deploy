import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import userRouter from './routes/users';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const PgSessionStore = pgSession(session);

app.get('/api-docs-json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  session({
    store: new PgSessionStore({
      pool: pool,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || 'localhost',
      path: '/',
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log(`Users Service listening on port ${PORT}`);
});
