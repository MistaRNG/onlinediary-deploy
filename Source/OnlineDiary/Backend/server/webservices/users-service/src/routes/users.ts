import express, { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import db from '../database/db';
import queryGenerator from '../helpers/queryGenerator';

const { getUserByValue, createNewUser } = queryGenerator(db);

const router = express.Router();

router.post('/login', async (req: any, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Benutzername und Passwort sind erforderlich' });
    }

    const user = await getUserByValue('username', username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    req.session.user_id = user.id;

    res.status(200).json({ message: 'Erfolgreich angemeldet', username: user.username });
  } catch (error) {
    next(error);
  }
});

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
    res.status(201).json({ message: 'Benutzer erfolgreich registriert', username: newUser.username });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req: any, res: Response) => {
  req.session.user_id = null;
  res.status(200).json({ message: 'Erfolgreich abgemeldet' });
});

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
