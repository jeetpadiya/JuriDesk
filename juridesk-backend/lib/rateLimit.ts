export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const chunkArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

export const isRateLimitError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as {
    status?: number;
    code?: number | string;
    message?: string;
  };

  const message = (err.message ?? '').toLowerCase();

  return (
    err.status === 429 ||
    err.code === 429 ||
    err.code === '429' ||
    message.includes('rate limit') ||
    message.includes('rpm') ||
    message.includes('quota') ||
    message.includes('resource exhausted') ||
    message.includes('too many requests')
  );
};

export const withRateLimitRetry = async <T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    retryDelayMs?: number;
  }
): Promise<T> => {
  const maxRetries = options?.maxRetries ?? 5;
  const retryDelayMs = options?.retryDelayMs ?? 10_000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;

      if (!isRateLimitError(error) || isLastAttempt) {
        throw error;
      }

      const waitMs = retryDelayMs * (attempt + 1);

      console.warn(
        `Rate limit hit. Retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${maxRetries})...`
      );

      await sleep(waitMs);
    }
  }

  throw new Error('Rate limit retry failed');
};
