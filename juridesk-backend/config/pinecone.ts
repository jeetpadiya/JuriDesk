import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { getChunkedDocs } from '../chunking/chunk.js';

dotenv.config();

export const uploadChunksToPinecone = async () => {
  const indexName = process.env.PINECONE_INDEX_NAME;

  if (!indexName) {
    throw new Error('PINECONE_INDEX_NAME is not defined in environment variables');
  }

  const { default: embeddings } = await import('../embeddings/googleEmbeddings.js');
  const chunkedDocs = await getChunkedDocs();

  const validDocs = chunkedDocs.filter(
    (doc) => doc.pageContent && doc.pageContent.trim().length > 0
  );

  console.log(
    `Starting Pinecone ingestion: ${validDocs.length} valid chunk(s).`
  );

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(indexName);

  await PineconeStore.fromDocuments(validDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 1,
  });

  console.log(
    `Pinecone ingestion complete. Uploaded ${validDocs.length} chunk(s) to "${indexName}".`
  );
};

export const initPineconeIngestion = () => {
  uploadChunksToPinecone().catch((error: any) => {
    if (error?.status === 429 || error?.message?.includes('Quota') || error?.message?.includes('429')) {
      console.warn(
        '⚠️ Pinecone ingestion paused: Google Gemini Free Tier daily limit (1,000 requests/day) reached. Ingestion will resume when your quota resets.'
      );
    } else {
      console.error('Pinecone ingestion failed:', error);
    }
  });
};
