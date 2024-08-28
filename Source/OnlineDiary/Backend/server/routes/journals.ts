import { Router, Response, NextFunction } from "express";
import queryGenerator from "../database/helpers/journals";

export default (db: any) => {
  const router = Router();
  const { postJournal, getJournals, deleteJournal, getPublicJournals } = queryGenerator(db);

  router.post("/", async (req: any, res: Response, next: NextFunction) => {
    const { content, date, title, is_public } = req.body;
    const userId = req.session.user_id;

    if (userId === undefined) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      await postJournal(content, userId, date, title, is_public);
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  });

  router.get("/get-id-by-date", async (req, res, next) => {
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
        return res.status(204).json({});
      }

      res.status(200).json({ journalId: rows[0].id });
    } catch (error) {
      console.error("Error during DB query:", error);
      next(error);
    }
  });

  router.get("/", async (req: any, res: Response, next: NextFunction) => {
    const userId = req.session.user_id;

    if (userId === undefined) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const info = await getJournals(userId);
      res.json(info);
    } catch (error) {
      next(error);
    }
  });

  router.get("/public", async (req: any, res: Response, next: NextFunction) => {
    try {
      const publicJournals = await getPublicJournals();
      res.json(publicJournals);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/", async (req: any, res: Response, next: NextFunction) => {
    const userId = req.session.user_id;
    const { date } = req.body;

    if (userId === undefined) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      await deleteJournal(userId, date);
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
