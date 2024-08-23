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

  router.post("/comments", async (req: any, res: Response, next: NextFunction) => {
    const { journal_id, content } = req.body;
    const userId = req.session.user_id;

    if (userId === undefined) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const comment = await postComment(userId, journal_id, content);
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
