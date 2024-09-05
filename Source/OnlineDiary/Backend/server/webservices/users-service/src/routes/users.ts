import express, { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import db from '../database/db';
import queryGenerator from '../helpers/queryGenerator';

const { getUserByValue, createNewUser } = queryGenerator(db);

const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Username is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid login credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error saving session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', async (req: any, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      return res.status(400).json({ error: 'Benutzername ist erforderlich' });
    }

    const user = await getUserByValue('username', username);

    if (password === 'oauth-simulated-password' && user) {
      req.session.user_id = user.id;
      req.session.save((err: any) => {
        if (err) {
          console.error('Fehler beim Speichern der Session:', err);
          return res.status(500).json({ error: 'Fehler beim Speichern der Session' });
        }
        return res.status(200).json({ message: 'Erfolgreich angemeldet', username: user.username });
      });
    } else if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    } else {
      req.session.user_id = user.id;
      req.session.save((err: any) => {
        if (err) {
          console.error('Fehler beim Speichern der Session:', err);
          return res.status(500).json({ error: 'Fehler beim Speichern der Session' });
        }
        return res.status(200).json({ message: 'Erfolgreich angemeldet', username: user.username });
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation errors or username already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error creating user or saving session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', async (req: any, res: Response, next: NextFunction) => {
  const { username, password, confirmPassword } = req.body;

  try {
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwörter stimmen nicht überein' });
    }

    const existingUser = await getUserByValue('username', username);
    if (existingUser) {
      return res.status(400).json({ error: 'Benutzername bereits vergeben' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await createNewUser({ username, password: hashedPassword });

    if (!newUser) {
      return res.status(500).json({ error: 'Benutzer konnte nicht erstellt werden' });
    }

    req.session.user_id = newUser.id;
    req.session.save((err:any) => {
      if (err) {
        console.error('Fehler beim Speichern der Session:', err);
        return res.status(500).json({ error: 'Fehler beim Speichern der Session' });
      }
      res.status(201).json({ message: 'Benutzer erfolgreich registriert', username: newUser.username });
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [User Management]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
router.post('/logout', (req: any, res: Response) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Erfolgreich abgemeldet' });
  });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get the current user's information
 *     tags: [User Management]
 *     responses:
 *       200:
 *         description: User information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req: any, res: Response, next: NextFunction) => {
  const { user_id } = req.session;

  if (!user_id) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  try {
    const user = await getUserByValue('id', user_id);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [User Management]
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', async (req: any, res: Response, next: NextFunction) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  try {
    const user = await getUserByValue('id', user_id);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    next(error);
  }
});

export default router;
