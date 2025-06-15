import express from 'express';
import { db } from './database.js';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/grid', (req, res) => {
  try {
    const grid = db.prepare('SELECT * FROM grid').all();
    res.status(200).json({ grid });
  } catch (error) {
    console.error('Error fetching grid data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/setGridColor', (req, res) => {
  try {
    const { x, y, color } = req.body;

    // Update the color in the database
    db.prepare('UPDATE grid SET color = ? WHERE x = ? AND y = ?').run(color, x, y);

    // Return the updated grid
    const grid = db.prepare('SELECT * FROM grid').all();
    res.status(200).json({ grid });
  } catch (error) {
    console.error('Error updating grid color:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
