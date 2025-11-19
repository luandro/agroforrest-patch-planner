import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  withRetry,
  retryAsync,
  withIndexedDBRetry,
  retryIndexedDB,
  isIndexedDBRetryable,
  RetryOptions
} from './retry';

describe('retry utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      const resultPromise = withRetry(fn);
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const resultPromise = withRetry(fn, { maxAttempts: 3, baseDelay: 100 });
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(3);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should fail after max attempts exceeded', async () => {
      const error = new Error('persistent failure');
      const fn = vi.fn().mockRejectedValue(error);

      const resultPromise = withRetry(fn, { maxAttempts: 3, baseDelay: 100 });
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe(error);
      expect(result.attempts).toBe(3);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should not retry non-retryable errors', async () => {
      const error = new Error('non-retryable');
      const fn = vi.fn().mockRejectedValue(error);
      const isRetryable = vi.fn().mockReturnValue(false);

      const resultPromise = withRetry(fn, { maxAttempts: 3, isRetryable });
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.success).toBe(false);
      expect(result.attempts).toBe(3);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(isRetryable).toHaveBeenCalledWith(error);
    });

    it('should call onRetry callback on each retry', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');
      const onRetry = vi.fn();

      const resultPromise = withRetry(fn, {
        maxAttempts: 3,
        baseDelay: 100,
        onRetry
      });
      await vi.runAllTimersAsync();
      await resultPromise;

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error), expect.any(Number));
      expect(onRetry).toHaveBeenCalledWith(2, expect.any(Error), expect.any(Number));
    });

    it('should respect maxDelay', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');
      const onRetry = vi.fn();

      const resultPromise = withRetry(fn, {
        maxAttempts: 2,
        baseDelay: 10000,
        maxDelay: 100,
        onRetry
      });
      await vi.runAllTimersAsync();
      await resultPromise;

      // Delay should be capped at maxDelay
      const [, , delay] = onRetry.mock.calls[0];
      expect(delay).toBeLessThanOrEqual(125); // maxDelay + 25% jitter
    });

    it('should apply exponential backoff', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockRejectedValueOnce(new Error('fail 3'))
        .mockResolvedValue('success');
      const onRetry = vi.fn();

      const resultPromise = withRetry(fn, {
        maxAttempts: 4,
        baseDelay: 100,
        backoffMultiplier: 2,
        maxDelay: 10000,
        onRetry
      });
      await vi.runAllTimersAsync();
      await resultPromise;

      // Check that delays increase exponentially (with some tolerance for jitter)
      const delays = onRetry.mock.calls.map(call => call[2]);
      expect(delays[0]).toBeLessThanOrEqual(125); // ~100 + jitter
      expect(delays[1]).toBeLessThanOrEqual(250); // ~200 + jitter
      expect(delays[2]).toBeLessThanOrEqual(500); // ~400 + jitter
      expect(delays[1]).toBeGreaterThan(delays[0]);
      expect(delays[2]).toBeGreaterThan(delays[1]);
    });
  });

  describe('retryAsync', () => {
    it('should return data on success', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      const resultPromise = retryAsync(fn);
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toBe('success');
    });

    it('should throw after max attempts', async () => {
      const error = new Error('persistent failure');
      const fn = vi.fn().mockRejectedValue(error);

      const resultPromise = retryAsync(fn, { maxAttempts: 2, baseDelay: 100 });

      // Run timers and expect rejection in parallel
      await expect(
        Promise.all([vi.runAllTimersAsync(), resultPromise])
      ).rejects.toThrow('persistent failure');
    });
  });

  describe('isIndexedDBRetryable', () => {
    it('should return true for retryable DOMException errors', () => {
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      const unknownError = new DOMException('Unknown error', 'UnknownError');

      expect(isIndexedDBRetryable(quotaError)).toBe(true);
      expect(isIndexedDBRetryable(unknownError)).toBe(true);
    });

    it('should return false for non-retryable DOMException errors', () => {
      const constraintError = new DOMException('Constraint error', 'ConstraintError');
      const dataError = new DOMException('Data error', 'DataError');
      const notFoundError = new DOMException('Not found', 'NotFoundError');

      expect(isIndexedDBRetryable(constraintError)).toBe(false);
      expect(isIndexedDBRetryable(dataError)).toBe(false);
      expect(isIndexedDBRetryable(notFoundError)).toBe(false);
    });

    it('should return true for generic errors', () => {
      const genericError = new Error('Something went wrong');
      expect(isIndexedDBRetryable(genericError)).toBe(true);
    });

    it('should return true for non-Error values', () => {
      expect(isIndexedDBRetryable('string error')).toBe(true);
      expect(isIndexedDBRetryable(null)).toBe(true);
      expect(isIndexedDBRetryable(undefined)).toBe(true);
    });
  });

  describe('withIndexedDBRetry', () => {
    it('should use IndexedDB retry logic', async () => {
      const constraintError = new DOMException('Constraint error', 'ConstraintError');
      const fn = vi.fn().mockRejectedValue(constraintError);

      const resultPromise = withIndexedDBRetry(fn, { maxAttempts: 3, baseDelay: 100 });
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      // Should not retry because ConstraintError is not retryable
      expect(result.success).toBe(false);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry retryable IndexedDB errors', async () => {
      const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
      const fn = vi.fn()
        .mockRejectedValueOnce(quotaError)
        .mockResolvedValue('success');

      const resultPromise = withIndexedDBRetry(fn, { maxAttempts: 3, baseDelay: 100 });
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.success).toBe(true);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('retryIndexedDB', () => {
    it('should return data on success', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      const resultPromise = retryIndexedDB(fn);
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result).toBe('success');
    });

    it('should throw on non-retryable error', async () => {
      const constraintError = new DOMException('Constraint error', 'ConstraintError');
      const fn = vi.fn().mockRejectedValue(constraintError);

      const resultPromise = retryIndexedDB(fn, { maxAttempts: 3, baseDelay: 100 });

      // Run timers and expect rejection in parallel
      await expect(
        Promise.all([vi.runAllTimersAsync(), resultPromise])
      ).rejects.toThrow('Constraint error');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle async functions that return undefined', async () => {
      const fn = vi.fn().mockResolvedValue(undefined);

      const resultPromise = withRetry(fn);
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
    });

    it('should handle single attempt (maxAttempts = 1)', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('fail'));

      const resultPromise = withRetry(fn, { maxAttempts: 1 });
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.success).toBe(false);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should preserve error type through retries', async () => {
      class CustomError extends Error {
        code: number;
        constructor(message: string, code: number) {
          super(message);
          this.code = code;
        }
      }

      const customError = new CustomError('Custom failure', 500);
      const fn = vi.fn().mockRejectedValue(customError);

      const resultPromise = withRetry(fn, { maxAttempts: 1 });
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.error).toBe(customError);
      expect((result.error as CustomError).code).toBe(500);
    });
  });
});
