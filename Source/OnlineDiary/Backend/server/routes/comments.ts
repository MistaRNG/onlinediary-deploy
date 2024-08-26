import { Router, Response, NextFunction } from "express";

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

  router.post("/", async (req: any, res: Response, next: NextFunction) => {
    const { journal_id, content } = req.body;
    const userId = req.session.user_id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const comment = await postComment(userId, journal_id, content);
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:journal_id", async (req: any, res: Response, next: NextFunction) => {
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
