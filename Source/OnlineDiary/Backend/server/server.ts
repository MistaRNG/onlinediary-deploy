import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;
import express, { Request, Response, NextFunction } from "express";
const app = express();

import cookieSession from "cookie-session";
app.use(
  cookieSession({ 
    secret: process.env.SECRET || "default_secret" 
  })
);

import { Pool } from "pg";
import dbParams from "./lib/db";
const db = new Pool(dbParams);
db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import usersRoutes from "./routes/users";
import journalsRoutes from "./routes/journals";
import modeRoutes from "./routes/mode";
import commentsRoutes from "./routes/comments";
import likesRoutes from "./routes/likes";

app.use("/api/users", usersRoutes(db as any));
app.use("/api/journals", journalsRoutes(db as any));
app.use("/api/mode", modeRoutes());
app.use("/api/comments", commentsRoutes(db as any));
app.use("/api/likes", likesRoutes(db as any));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(401).send(err.message);
  next();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
