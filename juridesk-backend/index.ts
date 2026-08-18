import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { initPineconeIngestion } from './config/pinecone.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Start HTTP Listener
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);

      // 3. Background Pinecone document embedding ingestion
      if (process.env.RUN_PINECONE_INGESTION === 'true') {
        console.log('RUN_PINECONE_INGESTION enabled. Starting background ingestion...');
        initPineconeIngestion();
      } else {
        console.log(
          'Pinecone auto-ingestion paused on startup. Trigger via POST /api/embeddings/ingest or set RUN_PINECONE_INGESTION=true.'
        );
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
