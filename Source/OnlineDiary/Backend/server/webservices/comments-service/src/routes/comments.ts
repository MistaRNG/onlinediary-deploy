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

  /**
   * @swagger
   * /comments/{comment_id}:
   *   put:
   *     summary: Update a comment
   *     tags: [Comment Management]
   *     parameters:
   *       - in: path
   *         name: comment_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the comment to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *                 description: The new content of the comment
   *                 example: "This is the updated comment content"
   *     responses:
   *       200:
   *         description: The updated comment
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       400:
   *         description: Bad request
   *       404:
   *         description: Comment not found or not authorized
   */
  router.put('/:comment_id', async (req: any, res: Response, next: NextFunction) => {
    const { comment_id } = req.params;
    const { content } = req.body;
    const userId = req.session?.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    try {
      const query = `
        UPDATE comments
        SET content = $1, edited = true
        WHERE id = $2 AND user_id = $3
        RETURNING *;
      `;
      const values = [content, comment_id, userId];
      const { rows } = await db.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Comment not found or not authorized.' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      next(error);
    }
  });

  /**
   * @swagger
   * /comments/{comment_id}:
   *   delete:
   *     summary: Delete a comment
   *     tags: [Comment Management]
   *     parameters:
   *       - in: path
   *         name: comment_id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the comment to delete
   *     responses:
   *       200:
   *         description: The comment has been marked as deleted
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       400:
   *         description: Bad request
   *       404:
   *         description: Comment not found or not authorized
   */
  router.delete('/:comment_id', async (req: any, res: Response, next: NextFunction) => {
    const { comment_id } = req.params;
    const userId = req.session?.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const query = `
        UPDATE comments
        SET deleted = true
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;
      const values = [comment_id, userId];
      const { rows } = await db.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Comment not found or not authorized.' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
