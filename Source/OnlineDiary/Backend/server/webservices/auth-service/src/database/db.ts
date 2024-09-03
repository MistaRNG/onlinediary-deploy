import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const pool = new Pool(dbParams);

pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err: any) => {
    console.error('Error connecting to the database:', err);
  });

export default pool;
