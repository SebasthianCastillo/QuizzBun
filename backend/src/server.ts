import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db/postgres.ts";

const app = express();
app.use(express.json());

app.get()
app.
  pool.query("SELECT 1");
console.log("PostgreSQL connected");

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
