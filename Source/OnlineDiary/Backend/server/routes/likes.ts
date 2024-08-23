import { Router, Response, NextFunction } from "express";

export default (db: any) => {
  const router = Router();

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

  router.post("/likes", async (req: any, res: Response, next: NextFunction) => {
    const { journal_id } = req.body;
    const userId = req.session.user_id;

    if (userId === undefined) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const like = await postLike(userId, journal_id);
      res.status(200).json(like);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
