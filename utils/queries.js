export const initMoodTable = `
  CREATE TABLE IF NOT EXISTS mood_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    message TEXT,
    mood VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const saveMoodQuery = `
  INSERT INTO mood_history (user_id, message, mood) VALUES ($1, $2, $3);
`;

export const getHistoryQuery = `
  SELECT id, user_id, message, mood, timestamp FROM mood_history 
  WHERE user_id = $1 ORDER BY timestamp DESC;
`;

export const initJournalsTable = `
  CREATE TABLE IF NOT EXISTS journals (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT
  );
`;

export const saveJournalQuery = `
  INSERT INTO journals (session_id, content) VALUES ($1, $2);
`;

export const getJournalsQuery = `
  SELECT id, created_at, content FROM journals 
  WHERE session_id = $1 ORDER BY created_at DESC;
`;

export const initUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    country VARCHAR(50),
  );
`;