-- Run this in Neon console or local psql
CREATE DATABASE IF NOT EXISTS adhci_mara;

-- Connect to adhci_mara and run:
CREATE TABLE IF NOT EXISTS mood_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    message TEXT,
    mood VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS journals (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT
);

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    country VARCHAR(50)
);