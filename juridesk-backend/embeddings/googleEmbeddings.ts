import { GoogleGenerativeAIEmbeddings, GoogleGenerativeAIEmbeddingsParams } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PineconeCompatibleEmbeddingsParams extends GoogleGenerativeAIEmbeddingsParams {
  targetDimension?: number;
  batchSize?: number;
}

export class PineconeCompatibleEmbeddings extends GoogleGenerativeAIEmbeddings {
  targetDimension: number;
  batchSize: number;

  constructor(fields?: PineconeCompatibleEmbeddingsParams) {
    const apiKey =
      fields?.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    super({
      ...fields,
      apiKey,
      modelName: fields?.modelName || 'gemini-embedding-001',
      model: fields?.model || fields?.modelName || 'gemini-embedding-001',
      taskType: fields?.taskType ?? TaskType.RETRIEVAL_DOCUMENT,
    });

    this.targetDimension = fields?.targetDimension || 768;
    this.batchSize = fields?.batchSize || 10;
  }

  // Helper with exponential backoff and Google 429 Quota RetryInfo detection
  async retryWithBackoff<T>(fn: () => Promise<T>, retries = 5, delayMs = 2000): Promise<T> {
    try {
      return await fn();
    } catch (err: any) {
      if (retries <= 0) throw err;

      let waitMs = delayMs;

      // Extract recommended retry delay if returned by Google API RetryInfo
      const retryDelayStr = err?.errorDetails?.find?.(
        (d: any) => d?.['@type']?.includes('RetryInfo')
      )?.retryDelay;

      if (retryDelayStr && typeof retryDelayStr === 'string') {
        const seconds = parseFloat(retryDelayStr.replace('s', ''));
        if (!isNaN(seconds)) {
          waitMs = Math.max(delayMs, (seconds + 3) * 1000);
        }
      } else if (err?.status === 429 || err?.code === 429) {
        waitMs = Math.max(delayMs, 60_000);
      }

      console.warn(
        `[Google API Quota / Rate Limit] Waiting ${(waitMs / 1000).toFixed(1)}s before retry... (${retries} attempts left)`
      );
      await sleep(waitMs);
      return this.retryWithBackoff(fn, retries - 1, Math.min(waitMs * 1.5, 120_000));
    }
  }

  async embedQuery(text: string | { pageContent: string }): Promise<number[]> {
    const cleanText = typeof text === 'string' ? text : text.pageContent;
    const vector = await this.retryWithBackoff(() => super.embedQuery(cleanText));
    return vector.slice(0, this.targetDimension);
  }

  async embedDocuments(documents: (string | { pageContent: string })[]): Promise<number[][]> {
    const results: number[][] = [];

    const rawTexts = documents.map((doc) =>
      typeof doc === 'string' ? doc : doc.pageContent
    );

    for (let i = 0; i < rawTexts.length; i += this.batchSize) {
      const batch = rawTexts.slice(i, i + this.batchSize);

      const batchVectors = await this.retryWithBackoff(async () => {
        const vectors = await Promise.all(batch.map((text) => super.embedQuery(text)));
        if (!vectors || vectors.some((v) => !v || v.length === 0)) {
          throw new Error('Received empty vector from batch response');
        }
        return vectors;
      });

      for (const vector of batchVectors) {
        results.push(vector.slice(0, this.targetDimension));
      }

      console.log(
        `Processed ${Math.min(i + this.batchSize, rawTexts.length)} / ${rawTexts.length} chunks...`
      );

      await sleep(1500);
    }

    return results;
  }
}

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

const embeddings = new PineconeCompatibleEmbeddings({
  apiKey,
  modelName: 'gemini-embedding-001',
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  targetDimension: 768,
  batchSize: 10,
});

export default embeddings;