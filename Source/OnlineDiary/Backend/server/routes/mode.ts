import { Response, Router } from "express";

const router = Router();

export default () => {
  router.post("/", (req: any, res: Response) => {
    const { darkMode } = req.body;
    req.session.dark_mode = !darkMode;
    res.json(req.session.dark_mode);
  });

  router.get("/", (req: any, res: Response) => {
    const hasSetting = "dark_mode" in req.session;
    if (!hasSetting) return res.json(true);
    const { dark_mode } = req.session;
    res.json(dark_mode);
  });

  return router;
};
