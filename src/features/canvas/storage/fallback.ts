/**
 * localStorage fallback functions for when IndexedDB is unavailable
 */
import { storageLogger } from '@/lib/logger';
import { STORAGE_KEYS, StorageKey } from './schema';

/**
 * Save data to localStorage as fallback
 */
export const saveToLocalStorageFallback = <T>(key: StorageKey, data: T): void => {
  try {
    const storageKey = STORAGE_KEYS[key];
    localStorage.setItem(storageKey, JSON.stringify(data));
    storageLogger.debug(`Saved to localStorage fallback: ${key}`, {
      dataLength: Array.isArray(data) ? data.length : 'N/A'
    });
  } catch (error) {
    storageLogger.error('Failed to save to localStorage', error);
  }
};

/**
 * Load data from localStorage fallback
 * Handles backwards compatibility for values stored as plain strings (pre-JSON encoding)
 */
export const loadFromLocalStorageFallback = <T>(key: StorageKey, defaultValue: T): T => {
  try {
    const storageKey = STORAGE_KEYS[key];
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        storageLogger.debug(`Loaded from localStorage fallback: ${key}`);
        return parsed;
      } catch {
        // Backwards compatibility: if JSON.parse fails, the value may be a plain string
        // (e.g., currentPatchId was previously stored without JSON encoding)
        storageLogger.debug(`Loaded raw string from localStorage fallback: ${key}`);
        return stored as unknown as T;
      }
    }
  } catch (error) {
    storageLogger.error('Failed to load from localStorage', error);
  }
  return defaultValue;
};
