import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import OpenAI from 'openai';
import { detectCrisis } from './mara.js';
import { initDb, saveMood, saveJournal, getJournals, getHistory } from './utils/db.js';
import { Mara } from './mara.js';
import path from 'path';

// Load .env with explicit path
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Debug: Log DATABASE_URL to check loading (remove after fix)
console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'MISSING');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Enable SSL for Neon, ignore cert errors in dev
});
initDb(pool); // Init tables if needed

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;
const useOpenAI = !!openai;

const SYSTEM_PROMPT = `You are Mara 🌸, a compassionate AI companion in the Healing Circle. Be empathetic, non-judgmental, and supportive for mental health. Encourage coping strategies like deep breathing or gratitude journaling. If sad, suggest Bible verses (e.g., Psalm 34:18) and activities (e.g., short walk). Detect mood implicitly and respond accordingly. If crisis (self-harm/suicide), urge immediate emergency contact and offer hotlines. Use simple, warm language. No diagnoses.`;

const mara = new Mara(); // For fallback

// Crisis keywords (from server.py)
const CRISIS_KEYWORDS = [
  /kill myself/, /i want to die/, /suicid/, /end my life/, /hurting myself/,
  /cant go on/, /no reason to live/, /die alone/, /i want to kill/,
  /i want to go in love/, /i hate myself/, /worthless/, /give up on life/,
  /i am a burden/, /nobody cares/, /i can't take this anymore/,
  /i feel hopeless/, /i feel trapped/, /i feel like a failure/,
  /i want to disappear/, /i want to end it all/, /i want to commit/
];

function isCrisis(text) {
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.some(pat => pat.test(t));
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { session_id = 'anon', message = '' } = req.body;
  if (!message.trim()) return res.status(400).json({ ok: false, error: 'empty message' });

  const userText = message.trim();

  // Crisis first
  if (isCrisis(userText)) {
    const safetyText = `I'm really sorry — it sounds like you're in serious distress. If you're thinking about harming yourself, please contact emergency services now (Rwanda: 112) or a trusted person. Would you like local helplines or coping steps?`;
    return res.json({ ok: true, crisis: true, reply: safetyText });
  }

  // Detect mood and save
  const mood = mara.detectMood(userText);
  await saveMood(pool, session_id, userText, mood);

  let reply;
  if (useOpenAI) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userText }
        ],
        max_tokens: 300,
        temperature: 0.7
      });
      reply = completion.choices[0].message.content.trim();
    } catch (err) {
      console.error('OpenAI error:', err);
      reply = mara.reflectiveConversation(session_id, userText, mood); // Fallback
    }
  } else {
    reply = mara.reflectiveConversation(session_id, userText, mood);
  }

  res.json({ ok: true, crisis: false, reply });
});

// Journal endpoints
app.post('/api/journal', async (req, res) => {
  const { session_id = 'anon', content = '' } = req.body;
  if (!content.trim()) return res.status(400).json({ ok: false, error: 'empty content' });
  await saveJournal(pool, session_id, content.trim());
  res.json({ ok: true });
});

app.get('/api/journal', async (req, res) => {
  const { session_id = 'anon' } = req.query;
  const entries = await getJournals(pool, session_id);
  res.json({ ok: true, entries });

// New: History endpoint (mood from chats)
app.get('/api/history', async (req, res) => {
  const { session_id = 'anon'} = req.query;
  const history = await getHistory(pool, session_id);
  res.json({ ok: true, entries: history });
});
// Health check
app.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));