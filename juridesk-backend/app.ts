import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes.js';
import { uploadChunksToPinecone } from './config/pinecone.js';

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'JuriDesk API is running' });
});

// Embeddings Ingestion Endpoint
app.post('/api/embeddings/ingest', async (_req: Request, res: Response) => {
  try {
    await uploadChunksToPinecone();
    res.status(200).json({
      success: true,
      message: 'Documents embedded and uploaded to Pinecone successfully.',
    });
  } catch (error) {
    console.error('Embedding ingestion failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to embed and upload documents to Pinecone.',
    });
  }
});

// Route Handlers
app.use('/api/auth', authRoutes);

// 404 Route Not Found Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
