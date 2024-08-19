import { Router, Response, NextFunction } from "express";
import queryGenerator from "../database/helpers/journals";

export default (db: any) => {
  const router = Router();
  const { postJournal, getJournals, deleteJournal } = queryGenerator(db);

  router.post("/", async (req: any, res: Response, next: NextFunction) => {
    const { content, date, title } = req.body;
    const userId = req.session.user_id;

    if (userId === undefined) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      await postJournal(content, userId, date, title);
      res.status(200).json();
    } catch (error) {
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
