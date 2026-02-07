-- PostgreSQL Schema for QuizzBun Application
-- Run this in Railway PostgreSQL database

CREATE TABLE score (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for better performance
CREATE INDEX idx_score_name ON score(name);

-- Add index for created_at for sorting
CREATE INDEX idx_score_created_at ON score(created_at);

-- Optional: Add table for quiz questions (if needed in future)
-- CREATE TABLE questions (
--     id SERIAL PRIMARY KEY,
--     question_text TEXT NOT NULL,
--     options TEXT[] NOT NULL,
--     correct_answer INTEGER NOT NULL,
--     category VARCHAR(100),
--     difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Grant permissions (adjust user as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;