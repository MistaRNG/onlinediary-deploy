import { Router, Response, NextFunction } from 'express';

export default (db: any) => {
  const router = Router();

  const postComment = async (user_id: number, journal_id: number, content: string) => {
    const query = `
      INSERT INTO comments (user_id, journal_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [user_id, journal_id, content];
    const { rows } = await db.query(query, values);
    return rows[0];
  };

  const getComments = async (journal_id: number) => {
    const query = `
      SELECT comments.*, users.username FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE journal_id = $1
      ORDER BY created_at ASC;
    `;
    const values = [journal_id];
    const { rows } = await db.query(query, values);
    return rows;
  };

  /**
   * @swagger
   * /comments:
   *   post:
   *     summary: Create a new comment
   *     tags: [Comment Management]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewComment'
   *     responses:
   *       200:
   *         description: The created comment
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   */
  router.post('/', async (req: any, res: Response, next: NextFunction) => {
    const { journal_id, content } = req.body;
    const userId = req.session?.user_id;
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
  
    if (!journal_id || !content) {
      return res.status(400).json({ error: 'Journal ID and content are required.' });
    }
  
    try {
      const comment = await postComment(userId, journal_id, content);
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  });  

  /**
   * @swagger
   * /comments/{journal_id}:
   *   get:
   *     summary: Get comments for a journal
   *     tags: [Comment Management]
   *     parameters:
   *       - in: path
   *         name: journal_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the journal
   *     responses:
   *       200:
   *         description: List of comments
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Comment'
   */
  router.get('/:journal_id', async (req: any, res: Response, next: NextFunction) => {
    const { journal_id } = req.params;

    try {
      const comments = await getComments(journal_id);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
