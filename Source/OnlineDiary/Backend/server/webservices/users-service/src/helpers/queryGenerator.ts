import { Pool } from 'pg';

interface User {
  id: number;
  username: string;
  password: string;
}

/**
 * Extracts the first row from the query result.
 *
 * @param rows - An object containing an array of rows from a query result.
 * @returns The first row if present, otherwise undefined.
 */
const getResult = ({ rows }: { rows: any[] }): any => rows.length && rows[0];

/**
 * Generates query functions for interacting with the users database.
 * 
 * @param db - The database connection pool.
 * @returns An object containing methods to interact with user data.
 */
const queryGenerator = (db: Pool) => {
  const getUserByValue = async (column: string, value: string): Promise<User | undefined> => {
    const values = [value];
    const queryString = `
      SELECT * FROM users 
      WHERE ${column} = $1;`;

    try {
      const result = await db.query(queryString, values);
      return getResult(result) as User | undefined;
    } catch (e) {
      throw e;
    }
  };

  /**
   * Retrieves a user from the database based on a specific column and value.
   * 
   * @param column - The column name to search by (e.g., 'username').
   * @param value - The value to search for in the specified column.
   * @returns A promise that resolves to the user object if found, otherwise undefined.
   * @throws Will throw an error if the database query fails.
   */
  const createNewUser = async ({ username, password }: { username: string; password: string; }): Promise<User | undefined> => {
    const values = [username, password];
    const queryString = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;`;

    try {
      const result = await db.query(queryString, values);
      return getResult(result) as User | undefined;
    } catch (e) {
      throw e;
    }
  };

  return { getUserByValue, createNewUser };
};

export default queryGenerator;
