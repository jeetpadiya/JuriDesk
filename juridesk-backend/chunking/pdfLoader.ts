import { DirectoryLoader } from '@langchain/classic/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically resolves document directories across source TS, compiled JS, or working directory contexts.
 */
const resolveDocsDir = (subdir: string): string | null => {
  const candidates = [
    path.resolve(process.cwd(), '..', 'docs', subdir),
    path.resolve(process.cwd(), 'docs', subdir),
    path.resolve(__dirname, '../../../docs', subdir),
    path.resolve(__dirname, '../../docs', subdir),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

const pdfLoadersMapping = {
  '.pdf': (filePath: string) => new PDFLoader(filePath),
};

export const loadRules = async () => {
  try {
    const rulesDirPath = resolveDocsDir('Rules');
    const codeDirPath = resolveDocsDir('Codes');

    console.log(`Rules directory path: ${rulesDirPath ?? 'Not found'}`);
    console.log(`Codes directory path: ${codeDirPath ?? 'Not found'}`);

    const loadTasks: Promise<any[]>[] = [];

    if (rulesDirPath) {
      const rulesLoader = new DirectoryLoader(rulesDirPath, pdfLoadersMapping);
      loadTasks.push(rulesLoader.load());
    } else {
      console.warn('Warning: Rules directory was not found.');
    }

    if (codeDirPath) {
      const codeLoader = new DirectoryLoader(codeDirPath, pdfLoadersMapping);
      loadTasks.push(codeLoader.load());
    } else {
      console.warn('Warning: Codes directory was not found.');
    }

    const loadedDocArrays = await Promise.all(loadTasks);
    const docs = loadedDocArrays.flat();

    console.log(`Successfully loaded ${docs.length} documents.`);

    if (docs.length > 0) {
      console.log('Sample Document Source:', docs[0].metadata.source);
      console.log('Sample Content Preview:', docs[0].pageContent.slice(0, 200));
    } else {
      console.warn('No PDF documents were found in the specified directories.');
    }

    return docs;
  } catch (error) {
    console.error('Error loading PDFs:', error);
    throw error;
  }
};