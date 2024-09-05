import { Router, Response } from 'express';

const router = Router();

export default () => {
  /**
   * @swagger
   * /mode:
   *   post:
   *     summary: Toggle dark mode setting
   *     tags: [Interface Mode Settings]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ModeToggleRequest'
   *     responses:
   *       200:
   *         description: The updated dark mode setting
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ModeResponse'
   *       500:
   *         description: An error occurred while toggling the mode.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/', (req: any, res: Response) => {
    const { darkMode } = req.body;
    req.session.dark_mode = !darkMode;
    res.json(req.session.dark_mode);
  });

  /**
   * @swagger
   * /mode:
   *   get:
   *     summary: Get current dark mode setting
   *     tags: [Interface Mode Settings]
   *     responses:
   *       200:
   *         description: The current dark mode setting
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ModeResponse'
   *       500:
   *         description: An error occurred while fetching the mode setting.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.get('/', (req: any, res: Response) => {
    const hasSetting = 'dark_mode' in req.session;
    if (!hasSetting) return res.json(true);
    const { dark_mode } = req.session;
    res.json(dark_mode);
  });

  return router;
};
