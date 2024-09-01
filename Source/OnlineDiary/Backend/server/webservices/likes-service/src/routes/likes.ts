import { Router, Response, NextFunction } from 'express';

export default (db: any) => {
  const router = Router();

  const getLikes = async (journal_id: number) => {
    const query = `
      SELECT COUNT(*) as count
      FROM likes
      WHERE journal_id = $1;
    `;
    const values = [journal_id];
    const { rows } = await db.query(query, values);
    return parseInt(rows[0].count, 10);
  };

  const hasUserLiked = async (user_id: number, journal_id: number) => {
    const query = `
      SELECT COUNT(*) as count
      FROM likes
      WHERE user_id = $1 AND journal_id = $2;
    `;
    const values = [user_id, journal_id];
    const { rows } = await db.query(query, values);
    return parseInt(rows[0].count, 10) > 0;
  };

  const postLike = async (user_id: number, journal_id: number) => {
    const query = `
      INSERT INTO likes (user_id, journal_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [user_id, journal_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  };

  const deleteLike = async (user_id: number, journal_id: number) => {
    const query = `
      DELETE FROM likes 
      WHERE user_id = $1 AND journal_id = $2
      RETURNING *;
    `;
    const values = [user_id, journal_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  };

  router.get('/:journal_id', async (req: any, res: Response, next: NextFunction) => {
    const { journal_id } = req.params;
    const userId = req.session?.user_id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const count = await getLikes(journal_id);
      const userLiked = await hasUserLiked(userId, journal_id);
      res.status(200).json({ count, userLiked });
    } catch (error) {
      next(error);
    }
  });

  router.get('/users/:journal_id', async (req: any, res: Response, next: NextFunction) => {
    const { journal_id } = req.params;

    try {
      const query = `
        SELECT users.username 
        FROM likes
        JOIN users ON likes.user_id = users.id
        WHERE journal_id = $1;
      `;
      const values = [journal_id];
      const { rows } = await db.query(query, values);

      res.status(200).json(rows.map((row: { username: string }) => row.username));
    } catch (error) {
      next(error);
    }
  });

  router.get('/:journal_id', async (req: any, res: Response, next: NextFunction) => {
    const { journal_id } = req.params;
    const userId = req.session?.user_id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const count = await getLikes(journal_id);
      const userLiked = await hasUserLiked(userId, journal_id);
      res.status(200).json({ count, userLiked });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req: any, res: Response, next: NextFunction) => {
    const { journal_id } = req.body;
    const userId = req.session?.user_id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const like = await postLike(userId, journal_id);
      res.status(200).json(like);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/', async (req: any, res: Response, next: NextFunction) => {
    const { journal_id } = req.body;
    const userId = req.session?.user_id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const like = await deleteLike(userId, journal_id);
      res.status(200).json(like);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
