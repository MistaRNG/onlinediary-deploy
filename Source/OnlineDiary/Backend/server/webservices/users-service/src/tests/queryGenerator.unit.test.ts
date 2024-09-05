import { Pool } from 'pg';
import queryGenerator from '../helpers/queryGenerator';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(() => Promise.resolve({ rows: [] })),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('queryGenerator', () => {
  let mockDb: Pool;
  let queries: ReturnType<typeof queryGenerator>;

  // ARRANGE
  beforeEach(() => {
    mockDb = new Pool();
    queries = queryGenerator(mockDb);
    jest.clearAllMocks();
  });

  it('should get user by value', async () => {
    // ACT
    await queries.getUserByValue('username', 'testuser');

    // ASSERT
    expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('WHERE username = $1;'), ['testuser']);
  });

  it('should create a new user', async () => {
    // ACT
    await queries.createNewUser({ username: 'newuser', password: 'newpassword' });

    // ASSERT
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users (username, password)'),
      ['newuser', 'newpassword']
    );
  });
});
