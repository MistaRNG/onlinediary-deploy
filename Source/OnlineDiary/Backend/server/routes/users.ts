import express, { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import {
  ERROR_INCORRECT_CREDENTIALS,
  ERROR_BLANK_PASSWORD,
  ERROR_BLANK_USERNAME,
  ERROR_PASSWORDS_NOT_MATCH,
  ERROR_USERNAME_ALREADY_TAKEN,
  ERROR_USERNAME_TOO_LONG,
  USERNAME_MAX_LENGTH,
} from "../constants";
import queryGenerator from "../database/helpers/users";
import { Pool } from "pg";

export default (db: Pool) => {
  const router = express.Router();
  const { getUserByValue, createNewUser } = queryGenerator(db);

  router.post("/", async (req: any, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      if (!username) throw new Error(ERROR_BLANK_USERNAME);
      if (!password) throw new Error(ERROR_BLANK_PASSWORD);

      const user = await getUserByValue("username", username);
      if (!user) {
        throw new Error(ERROR_INCORRECT_CREDENTIALS);
      }

      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) throw new Error(ERROR_INCORRECT_CREDENTIALS);

      req.session.user_id = user.id;
      res.json(user.username);
    } catch (error) {
      next(error);
    }
  });

  router.post("/register", async (req: any, res: Response, next: NextFunction) => {
    const { username, password, confirmPassword } = req.body;

    try {
      if (!username) throw new Error(ERROR_BLANK_USERNAME);

      if (username.length > USERNAME_MAX_LENGTH) {
        throw new Error(ERROR_USERNAME_TOO_LONG);
      }
      if (!password || !confirmPassword) throw new Error(ERROR_BLANK_PASSWORD);

      const passwordIsSame = confirmPassword === password;
      if (!passwordIsSame) throw new Error(ERROR_PASSWORDS_NOT_MATCH);

      const userWithSameUsername = await getUserByValue("username", username);

      if (userWithSameUsername) {
        throw new Error(ERROR_USERNAME_ALREADY_TAKEN);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const userInfo = { username, password: hashedPassword };

      const user = await createNewUser(userInfo);
      if (!user) {
        throw new Error("User creation failed");
      }
      req.session.user_id = user.id;
      res.json(user.username);
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", (req: any, res: Response) => {
    req.session.user_id = null;
    res.json(null);
  });

  router.get("/", async (req: any, res: Response, next: NextFunction) => {
    const { user_id } = req.session;
    if (!user_id) return res.json(null);
    try {
      const user = await getUserByValue("id", user_id);
      if (!user) {
        return res.json(null);
      }
      res.json(user.username);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
