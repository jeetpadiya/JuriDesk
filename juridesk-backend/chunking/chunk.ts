import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { loadRules } from './pdfLoader.js';

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export const getChunkedDocs = async () => {
  const docs = await loadRules();
  const chunkedDocs = await textSplitter.splitDocuments(docs);

  console.log(`Created ${chunkedDocs.length} chunks.`);

  return chunkedDocs;
};