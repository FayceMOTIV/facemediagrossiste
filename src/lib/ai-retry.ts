interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, initialDelayMs = 1000, maxDelayMs = 8000, factor = 2 } = options;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      if (attempt === maxAttempts) break;
      // Don't retry on 4xx (client errors)
      if (error instanceof Error && error.message.includes('400')) break;
      if (error instanceof Error && error.message.includes('401')) break;
      if (error instanceof Error && error.message.includes('403')) break;
      const delay = Math.min(initialDelayMs * Math.pow(factor, attempt - 1), maxDelayMs);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
