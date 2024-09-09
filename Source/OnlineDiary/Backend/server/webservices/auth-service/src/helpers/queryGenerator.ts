import { Pool } from 'pg';

interface User {
  id: number;
  username: string;
  password: string;
}

/**
 * Extracts the first row from the query result if rows are present, otherwise returns null.
 * 
 * @param rows - The rows returned from the database query.
 * @returns The first row if present, otherwise null.
 */
const getResult = ({ rows }: { rows: any[] }): any => (rows.length ? rows[0] : null);

/**
 * Generates query functions for interacting with the user database.
 * 
 * @param db - The database connection pool.
 * @returns An object containing methods to interact with user data.
 */
const queryGenerator = (db: Pool) => {
  
  /**
   * Retrieves a user from the database based on a specified column and value.
   * 
   * @param column - The column to query (e.g., 'username' or 'id').
   * @param value - The value to search for in the specified column.
   * @returns The user object if found, otherwise undefined.
   * @throws Will throw an error if the database query fails.
   */
  const getUserByValue = async (column: string, value: string): Promise<User | undefined> => {
    const values = [value];
    const queryString = `
      SELECT * FROM users 
      WHERE ${column} = $1;`;

    try {
      const result = await db.query(queryString, values);
      return getResult(result) as User | undefined;
    } catch (e) {
      console.error('Error executing getUserByValue:', e);
      throw e;
    }
  };

  /**
   * Creates a new user in the database with the given username and password.
   * 
   * @param username - The username of the new user.
   * @param password - The password of the new user.
   * @returns The created user object if successful, otherwise undefined.
   * @throws Will throw an error if the database query fails.
   */
  const createNewUser = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User | undefined> => {
    const values = [username, password];
    const queryString = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;`;

    try {
      const result = await db.query(queryString, values);
      return getResult(result) as User | undefined;
    } catch (e) {
      console.error('Error executing createNewUser:', e);
      throw e;
    }
  };

  return { getUserByValue, createNewUser };
};

export default queryGenerator;
