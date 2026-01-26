import pkg from "pg";
const { Pool } = pkg;

const user = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || "bombazo";

console.log("Connecting with:", { user, password: typeof password });

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "quizz",
  user, // obligatorio usar el valor forzado
  password, // obligatorio usar el valor forzado
  ssl: false,
});
