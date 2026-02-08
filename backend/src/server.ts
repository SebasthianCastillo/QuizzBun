import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db/postgres.ts";
import cors from "cors";

const app = express();
app.use(express.json());

// Updated CORS configuration for production
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production'
//     ? ['https://quizz-bun-frontend-jfwq.vercel.app/', 'backend-production-04b0.up.railway.app']
//     : '*',
//   credentials: true
// }));

const allowedOrigins = [
  'https://quizz-bun-frontend-jfwq.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / mobile / SSR

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Production port handling
const PORT = process.env.PORT || 3000;

app.post("/addScore", async (req, res) => {
  try {
    const { name, score } = req.body;
    const query = "INSERT INTO score (name, score) VALUES ($1, $2)"
    const values = [name, score];
    await pool.query(query, values);


    res.status(200).json({ message: "score added" });
  } catch (error) {
    console.error("Error fetching :", error);
    res.status(500).json({ message: "Error scores" });
  }
});
app.get("/getScore", async (req, res) => {
  try {
    const query = "SELECT * FROM score"
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Error fetching scores" });
  }
})
pool.query("SELECT 1");
console.log("PostgreSQL connected");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
