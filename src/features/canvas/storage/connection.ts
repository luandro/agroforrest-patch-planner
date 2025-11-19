/**
 * Database connection and schema management
 */
import { storageLogger } from '@/lib/logger';
import {
  DB_NAME,
  DB_VERSION,
  PATCHES_STORE_NAME,
  BEDS_STORE_NAME,
  PLACEMENTS_STORE_NAME
} from './schema';

/**
 * Opens IndexedDB with proper schema management
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const transaction = (event.target as IDBOpenDBRequest).transaction!;

      storageLogger.info(`Upgrading database schema to version ${DB_VERSION}`);

      // Create patches store
      if (!db.objectStoreNames.contains(PATCHES_STORE_NAME)) {
        const patchStore = db.createObjectStore(PATCHES_STORE_NAME, { keyPath: 'id' });
        patchStore.createIndex('createdAt', 'createdAt', { unique: false });
        storageLogger.info('Created patches store');
      }

      // Create beds store
      if (!db.objectStoreNames.contains(BEDS_STORE_NAME)) {
        const bedStore = db.createObjectStore(BEDS_STORE_NAME, { keyPath: 'id' });
        bedStore.createIndex('patchId', 'patchId', { unique: false });
        storageLogger.info('Created beds store');
      }

      // Create placements store
      if (!db.objectStoreNames.contains(PLACEMENTS_STORE_NAME)) {
        const placementStore = db.createObjectStore(PLACEMENTS_STORE_NAME, { keyPath: 'id' });
        placementStore.createIndex('patchId', 'patchId', { unique: false });
        placementStore.createIndex('bedId', 'bedId', { unique: false });
        storageLogger.info('Created placements store');
      }

      // Migration: Add patchId to existing placements if needed
      if (transaction && db.objectStoreNames.contains(PLACEMENTS_STORE_NAME)) {
        const placementStore = transaction.objectStore(PLACEMENTS_STORE_NAME);
        const bedStore = transaction.objectStore(BEDS_STORE_NAME);

        const migrationPromises: Promise<void>[] = [];

        placementStore.openCursor().onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const placement = cursor.value;
            if (!placement.patchId && placement.bedId) {
              const migrationPromise = new Promise<void>((resolve, reject) => {
                const bedRequest = bedStore.get(placement.bedId);
                bedRequest.onsuccess = () => {
                  const bed = bedRequest.result;
                  if (bed && bed.patchId) {
                    placement.patchId = bed.patchId;
                    const updateRequest = cursor.update(placement);
                    updateRequest.onsuccess = () => {
                      storageLogger.debug(`Migrated placement ${placement.id} to patch ${bed.patchId}`);
                      resolve();
                    };
                    updateRequest.onerror = () => reject(updateRequest.error);
                  } else {
                    resolve(); // Skip if bed not found
                  }
                };
                bedRequest.onerror = () => reject(bedRequest.error);
              });
              migrationPromises.push(migrationPromise);
            }
            cursor.continue();
          } else {
            // All cursor operations complete, wait for migrations
            Promise.all(migrationPromises).then(() => {
              storageLogger.info('Migration completed successfully');
            }).catch((error) => {
              storageLogger.error('Migration failed', error);
            });
          }
        };
      }
    };

    request.onsuccess = () => {
      storageLogger.info('Database opened successfully');
      resolve(request.result);
    };

    request.onerror = () => {
      storageLogger.error('Database error', request.error);
      reject(new Error('Failed to open database'));
    };

    request.onblocked = () => {
      storageLogger.warn('Database upgrade blocked. Please close other tabs.');
    };
  });
};

/**
 * Checks if IndexedDB is available and working
 */
export const isIndexedDBAvailable = async (): Promise<boolean> => {
  try {
    if (!window.indexedDB) return false;

    // Test if we can actually use IndexedDB
    const testDB = await openDB();
    testDB.close();
    return true;
  } catch (error) {
    storageLogger.warn('IndexedDB not available, falling back to localStorage', error);
    return false;
  }
};
