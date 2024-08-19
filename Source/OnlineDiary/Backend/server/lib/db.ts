interface DbParams {
  connectionString?: string;
  ssl?: { rejectUnauthorized: boolean };
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

let dbParams: DbParams = {};

if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
  dbParams.ssl = { rejectUnauthorized: false };
} else {
  dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
}

export default dbParams;
