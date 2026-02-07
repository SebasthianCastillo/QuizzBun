import { Pool } from 'pg';

// Use DATABASE_URL if available, otherwise fall back to individual variables
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: connectionString,
  // Fallback to individual variables if DATABASE_URL not set
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'quizz',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
