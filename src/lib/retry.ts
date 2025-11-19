/**
 * Retry utility with exponential backoff for handling transient failures
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;
  /** Initial delay in milliseconds (default: 100) */
  baseDelay?: number;
  /** Maximum delay in milliseconds (default: 5000) */
  maxDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
  /** Function to determine if error is retryable (default: always retry) */
  isRetryable?: (error: unknown) => boolean;
  /** Callback for each retry attempt */
  onRetry?: (attempt: number, error: unknown, delay: number) => void;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: unknown;
  attempts: number;
}

/**
 * Default function to determine if an IndexedDB error is retryable
 */
export const isIndexedDBRetryable = (error: unknown): boolean => {
  if (error instanceof DOMException) {
    // Only retry specific, known transient errors
    const retryableErrors = [
      'QuotaExceededError',     // Storage quota exceeded (might clear up)
      'UnknownError',          // Transient database errors
      'TransactionInactiveError', // Transaction timing issues
    ];

    return retryableErrors.includes(error.name);
  }

  // Retry generic errors by default (e.g., network issues)
  return true;
};

/**
 * Sleep for a specified duration
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Calculate delay with exponential backoff and jitter
 */
const calculateDelay = (
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  multiplier: number
): number => {
  // Exponential backoff
  const exponentialDelay = baseDelay * Math.pow(multiplier, attempt - 1);

  // Add jitter (0-25% of delay) to prevent thundering herd
  const jitter = exponentialDelay * Math.random() * 0.25;

  // Cap at max delay
  return Math.min(exponentialDelay + jitter, maxDelay);
};

/**
 * Execute an async function with retry logic and exponential backoff
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => saveToDB(data),
 *   {
 *     maxAttempts: 3,
 *     isRetryable: isIndexedDBRetryable
 *   }
 * );
 *
 * if (result.success) {
 *   console.log('Saved:', result.data);
 * } else {
 *   console.error('Failed after', result.attempts, 'attempts:', result.error);
 * }
 * ```
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> => {
  const {
    maxAttempts = 3,
    baseDelay = 100,
    maxDelay = 5000,
    backoffMultiplier = 2,
    isRetryable = () => true,
    onRetry
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const data = await fn();
      return {
        success: true,
        data,
        attempts: attempt
      };
    } catch (error) {
      lastError = error;

      // Check if we should retry
      const shouldRetry = attempt < maxAttempts && isRetryable(error);

      if (!shouldRetry) {
        break;
      }

      // Calculate delay for next attempt
      const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffMultiplier);

      // Notify about retry
      if (onRetry) {
        onRetry(attempt, error, delay);
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  return {
    success: false,
    error: lastError,
    attempts: maxAttempts
  };
};

/**
 * Wrapper that throws on failure (for simpler usage when you want exceptions)
 *
 * @example
 * ```typescript
 * try {
 *   const data = await retryAsync(() => loadFromDB());
 * } catch (error) {
 *   // Handle after all retries failed
 * }
 * ```
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const result = await withRetry(fn, options);

  if (!result.success) {
    throw result.error;
  }

  return result.data as T;
};

/**
 * Pre-configured retry for IndexedDB operations
 */
export const withIndexedDBRetry = <T>(
  fn: () => Promise<T>,
  options: Omit<RetryOptions, 'isRetryable'> = {}
): Promise<RetryResult<T>> => {
  return withRetry(fn, {
    ...options,
    isRetryable: isIndexedDBRetryable
  });
};

/**
 * Pre-configured retry that throws for IndexedDB operations
 */
export const retryIndexedDB = <T>(
  fn: () => Promise<T>,
  options: Omit<RetryOptions, 'isRetryable'> = {}
): Promise<T> => {
  return retryAsync(fn, {
    ...options,
    isRetryable: isIndexedDBRetryable
  });
};
