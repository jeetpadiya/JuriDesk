import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import connectDB from './db.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'JuriDesk API is running' });
});

app.use('/api/auth', authRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
