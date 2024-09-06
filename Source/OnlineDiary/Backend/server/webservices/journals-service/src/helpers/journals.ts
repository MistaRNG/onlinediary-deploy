interface JournalEntry {
  id: number;
  user_id: number;
  date: string;
  title: string;
  content: any;
  is_public: boolean;
}

interface DB {
  query: (queryText: string, values?: any[]) => Promise<{ rows: any[] }>;
}

const queryGenerator = (db: DB) => {
  const getJournals = async (id: number): Promise<JournalEntry[]> => {
    const values = [id];

    const queryString = `
      SELECT * FROM journals
      WHERE user_id = $1
      ORDER BY date;`;

    try {
      const { rows } = await db.query(queryString, values);
      for (const row of rows) {
        const { content } = row;
        row.content = JSON.parse(content);
      }
      return rows as JournalEntry[];
    } catch (e) {
      throw e;
    }
  };

  const getPublicJournals = async (): Promise<JournalEntry[]> => {
    const queryString = `
      SELECT * FROM journals
      WHERE is_public = true
      ORDER BY date DESC;`;

    try {
      const { rows } = await db.query(queryString);
      for (const row of rows) {
        const { content } = row;
        row.content = JSON.parse(content);
      }
      return rows as JournalEntry[];
    } catch (e) {
      throw e;
    }
  };

  const postJournal = async (
    content: any,
    id: number,
    date: string,
    title: string,
    is_public: boolean
  ): Promise<JournalEntry> => {
    const formattedContent = typeof content === 'string' ? content : JSON.stringify(content);
    const values2 = [formattedContent, id, date, title, is_public];

    const querySelectString = `
      SELECT * FROM journals
      WHERE user_id = $1 AND date = $2;`;

    const queryUpdateString = `
      UPDATE journals
      SET content = $1,
      title = $4,
      is_public = $5
      WHERE user_id = $2 AND date = $3
      RETURNING *;`;

    const queryInsertString = `
      INSERT INTO journals (content, user_id, date, title, is_public)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`;

    try {
      const { rows } = await db.query(querySelectString, [id, date]);
      const result = rows.length
        ? await db.query(queryUpdateString, values2)
        : await db.query(queryInsertString, values2);

      if (typeof result.rows[0].content === 'string') {
        try {
          result.rows[0].content = JSON.parse(result.rows[0].content);
        } catch (error) {
          console.error('Error parsing journal content:', error);
          throw new Error('Invalid content format stored in database.');
        }
      }

      return result.rows[0] as JournalEntry;
    } catch (e) {
      console.error('Database operation failed:', e);
      throw new Error('Failed to create or update the journal entry.');
    }
  };

  const deleteJournal = async (id: number, date: string): Promise<void> => {
    const values = [id, date];

    const queryDeleteString = `
      DELETE FROM journals
      WHERE user_id = $1 AND date = $2
      RETURNING *;`;

    try {
      await db.query(queryDeleteString, values);
    } catch (e) {
      throw e;
    }
  };

  return { postJournal, getJournals, getPublicJournals, deleteJournal };
};

export default queryGenerator;
