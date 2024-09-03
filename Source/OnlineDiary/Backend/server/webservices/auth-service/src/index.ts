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
  origin: 'http://localhost:3000',
  credentials: true,
}));

const PgSessionStore = pgSession(session);

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
      path: '/',
    },
  })
);

passport.use(
  new GitLabStrategy(
    {
      clientID: process.env.GITLAB_CLIENT_ID || '',
      clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3001/api/auth/gitlab/callback',
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

app.get('/api/auth/gitlab', passport.authenticate('gitlab'));

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
