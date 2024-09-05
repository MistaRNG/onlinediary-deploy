import { Router, Response, NextFunction } from 'express';
import queryGenerator from '../helpers/journals';

export default (db: any) => {
  const router = Router();
  const { postJournal, getJournals, deleteJournal, getPublicJournals } = queryGenerator(db);

  /**
   * @swagger
   * /journals:
   *   post:
   *     summary: Create or update a journal entry
   *     tags: [Journal Entries Management]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/JournalEntry'
   *     responses:
   *       200:
   *         description: The created or updated journal entry
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/JournalEntry'
   *       400:
   *         description: Error due to missing user ID or invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/', async (req: any, res: Response, next: NextFunction) => {
    const { content, date, title, is_public } = req.body;
    const userId = req.session.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const journal = await postJournal(content, userId, date, title, is_public);
      res.status(200).json(journal);
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /journals/get-id-by-date:
   *   get:
   *     summary: Get the ID of a journal entry by date
   *     tags: [Journal Entries Management]
   *     parameters:
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: The date of the journal entry
   *     responses:
   *       200:
   *         description: The ID of the journal entry
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 journalId:
   *                   type: integer
   *       204:
   *         description: No journal entry found for the given date
   */
  router.get('/get-id-by-date', async (req, res, next) => {
    const { date } = req.query;

    try {
      const query = `
        SELECT id 
        FROM journals 
        WHERE date = $1
      `;
      const values = [date];
      const { rows } = await db.query(query, values);

      if (rows.length === 0) {
        return res.status(204).send();
      }

      res.status(200).json({ journalId: rows[0].id });
    } catch (error) {
      console.error("Error during DB query:", error);
      next(error);
    }
  });

  /**
   * @swagger
   * /journals:
   *   get:
   *     summary: Get all journal entries for the authenticated user
   *     tags: [Journal Entries Management]
   *     responses:
   *       200:
   *         description: List of journal entries
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/JournalEntry'
   */
  router.get('/', async (req: any, res: Response, next: NextFunction) => {
    const userId = req.session.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const journals = await getJournals(userId);
      res.status(200).json(journals);
    } catch (error) {
      console.error('Error fetching journals for user ID:', userId, error);
      next(error);
    }
  });

  /**
   * @swagger
   * /journals/public:
   *   get:
   *     summary: Get all public journal entries
   *     tags: [Journal Entries Management]
   *     responses:
   *       200:
   *         description: List of public journal entries
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/JournalEntry'
   */
  router.get('/public', async (req: any, res: Response, next: NextFunction) => {
    try {
      const publicJournals = await getPublicJournals();
      res.status(200).json(publicJournals);
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /journals:
   *   delete:
   *     summary: Delete a journal entry
   *     tags: [Journal Entries Management]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               date:
   *                 type: string
   *                 format: date
   *     responses:
   *       200:
   *         description: Journal deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  router.delete('/', async (req: any, res: Response, next: NextFunction) => {
    const userId = req.session.user_id;
    const { date } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      await deleteJournal(userId, date);
      res.status(200).json({ message: 'Journal deleted successfully.' });
    } catch (error) {
      next(error);
    }
  });

  return router;
};