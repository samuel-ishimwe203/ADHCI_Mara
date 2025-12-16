import { saveMoodQuery, getHistoryQuery, saveJournalQuery, getJournalsQuery, initMoodTable, initJournalsTable, initUsersTable } from './queries.js'; // See below for queries

export async function initDb(pool) {
  try {
    await pool.query(initMoodTable);
    await pool.query(initJournalsTable);
    await pool.query(initUsersTable); // Optional users
    console.log('DB tables initialized');
  } catch (err) {
    console.error('DB init error:', err);
  }
}

export async function saveMood(pool, userId, message, mood) {
  try {
    await pool.query(saveMoodQuery, [userId, message, mood]);
  } catch (err) {
    console.error('Save mood error:', err);
  }
}

export async function getHistory(pool, userId) {
  try {
    const { rows } = await pool.query(getHistoryQuery, [userId]);
    return rows;
  } catch (err) 
    console.error('Get history error:', err);
    return [];
  }
}

export async function saveJournal(pool, sessionId, content) {
  try {
    await pool.query(saveJournalQuery, [sessionId, content]);
  } catch (err) {
    console.error('Save journal error:', err);
  }
}

export async function getJournals(pool, sessionId) {
  try {
    const { rows } = await pool.query(getJournalsQuery, [sessionId]);
    return rows;
  } catch (err) {
    console.error('Get journals error:', err);
    return [];
  }
}