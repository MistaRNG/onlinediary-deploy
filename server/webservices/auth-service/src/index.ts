import express, { Response, Request } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitLabStrategy, GitLabProfile } from 'passport-gitlab2';
import dotenv from 'dotenv';
import db from './database/db';
import queryGenerator from './helpers/queryGenerator';
import pgSession from 'connect-pg-simple';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig';

dotenv.config();

interface User {
  id: number;
  username: string;
}

const { getUserByValue, createNewUser } = queryGenerator(db);

declare module 'express-session' {
  interface SessionData {
    user_id: number;
  }
}

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

app.use(cors({
  origin: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  credentials: true,
}));

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
      domain: process.env.COOKIE_DOMAIN || 'localhost',
      path: '/',
    },
  })
);

passport.use(
  new GitLabStrategy(
    {
      clientID: process.env.GITLAB_CLIENT_ID || '',
      clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
      callbackURL: process.env.AUTH_SERVICE_CALLBACK_URL || 'http://localhost:3001/api/auth/gitlab/callback',
      baseURL: 'https://git.imn.htwk-leipzig.de',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  const typedUser = user as User;
  done(null, { id: typedUser.id, username: typedUser.username });
});

passport.deserializeUser((obj: any, done) => {
  const typedUser = obj as User;
  done(null, typedUser);
});

app.use(passport.initialize());
app.use(passport.session());

function createJWT(user: User) {
  const payload = { id: user.id, username: user.username };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

/**
 * @swagger
 * /auth/gitlab:
 *   get:
 *     summary: Start GitLab authentication
 *     tags: [Authentication and Authorization]
 *     description: "**Important Note:** This endpoint will redirect you to GitLab for authentication. This will not work within Swagger UI. Use the application to test it out."
 *     responses:
 *       302:
 *         description: Redirects to GitLab for authentication.
 */
app.get('/api/auth/gitlab', passport.authenticate('gitlab'));

/**
 * @swagger
 * /auth/gitlab/callback:
 *   get:
 *     summary: GitLab authentication callback
 *     tags: [Authentication and Authorization]
 *     description: |
 *       **Important Note:** This endpoint requires manual testing in your web browser.
 *       Swagger UI does not support redirects and cookies required for the OAuth flow.
 *       To test this, start the authentication process at `/auth/gitlab` directly in your browser, not via Swagger UI.
 *     responses:
 *       200:
 *         description: Authentication successful and session saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       302:
 *         description: Redirect to login on failure
 */
app.get('/api/auth/gitlab/callback', passport.authenticate('gitlab', { failureRedirect: '/login' }), async (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect('/?error=User data missing');
  }

  const gitlabUser = req.user as GitLabProfile;
  try {
    let existingUser = await getUserByValue('username', gitlabUser.username);
    if (!existingUser) {
      existingUser = await createNewUser({ username: gitlabUser.username, password: 'oauth-simulated-password' });
    }

    if (!existingUser) {
      console.error('Fehler: Benutzer konnte nicht erstellt werden.');
      return res.redirect('/?error=Fehler beim Erstellen des Benutzers');
    }

    req.session.user_id = existingUser.id;
    req.session.save((err) => {
      if (err) {
        console.error('Fehler beim Speichern der Session:', err);
        return res.redirect('/?error=Fehler beim Speichern der Session');
      }

      const token = createJWT({ id: existingUser.id, username: gitlabUser.username });

      res.send(`
        <script>
          window.opener.postMessage({ 
            token: '${token}', 
            username: '${existingUser.username}' 
          }, "http://localhost:3000");
          window.close();
        </script>
      `);
    });
  } catch (error) {
    console.error('Fehler beim Verarbeiten des Benutzers:', error);
    res.redirect('/?error=Fehler beim Verarbeiten des Benutzers');
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service listening on port ${PORT}`);
});
