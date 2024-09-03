import { Pool } from 'pg';

interface User {
  id: number;
  username: string;
  password: string;
}

const getResult = ({ rows }: { rows: any[] }): any => (rows.length ? rows[0] : null);

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
      console.error('Error executing getUserByValue:', e);
      throw e;
    }
  };

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
