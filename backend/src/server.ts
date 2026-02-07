import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { pool } from "./db/postgres.ts";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "*", // or restrict to your app origin if needed
    allowedHeaders: ["Content-Type", "Authorization"], // VERY IMPORTANT
  })
);

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
