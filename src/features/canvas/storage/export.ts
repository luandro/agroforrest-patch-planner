/**
 * Export/import functionality for data backup
 */
import { Patch } from '../types/patch.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { storageLogger } from '@/lib/logger';
import {
  PATCHES_STORE_NAME,
  BEDS_STORE_NAME,
  PLACEMENTS_STORE_NAME
} from './schema';
import { openDB, isIndexedDBAvailable } from './connection';
import { saveToLocalStorageFallback, loadFromLocalStorageFallback } from './fallback';

/**
 * Export all data to JSON string for backup
 */
export const exportAllData = async (): Promise<string> => {
  try {
    const data: {
      patches: Patch[];
      beds: Bed[];
      placements: PlantPlacement[];
      currentPatchId: string | null;
      exportedAt: number;
    } = {
      patches: [],
      beds: [],
      placements: [],
      currentPatchId: null,
      exportedAt: Date.now()
    };

    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([PATCHES_STORE_NAME, BEDS_STORE_NAME, PLACEMENTS_STORE_NAME], 'readonly');

      // Get all data
      const [patches, beds, placements] = await Promise.all([
        new Promise<unknown[]>((resolve, reject) => {
          const request = transaction.objectStore(PATCHES_STORE_NAME).getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        }),
        new Promise<unknown[]>((resolve, reject) => {
          const request = transaction.objectStore(BEDS_STORE_NAME).getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        }),
        new Promise<unknown[]>((resolve, reject) => {
          const request = transaction.objectStore(PLACEMENTS_STORE_NAME).getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        })
      ]);

      data.patches = patches as Patch[];
      data.beds = beds as Bed[];
      data.placements = placements as PlantPlacement[];
      data.currentPatchId = loadFromLocalStorageFallback('currentPatchId', null);

      db.close();
    } else {
      // Fallback to localStorage
      data.patches = loadFromLocalStorageFallback('patches', []);
      data.beds = loadFromLocalStorageFallback('beds', []);
      data.placements = loadFromLocalStorageFallback('placements', []);
      data.currentPatchId = loadFromLocalStorageFallback('currentPatchId', null);
    }

    return JSON.stringify(data, null, 2);
  } catch (error) {
    storageLogger.error('Failed to export data', error);
    throw error;
  }
};

/**
 * Import data from backup JSON string
 */
export const importAllData = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);

    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([PATCHES_STORE_NAME, BEDS_STORE_NAME, PLACEMENTS_STORE_NAME], 'readwrite');

      // Clear existing data
      transaction.objectStore(PATCHES_STORE_NAME).clear();
      transaction.objectStore(BEDS_STORE_NAME).clear();
      transaction.objectStore(PLACEMENTS_STORE_NAME).clear();

      // Import new data
      data.patches?.forEach((patch: unknown) => {
        transaction.objectStore(PATCHES_STORE_NAME).add(patch);
      });

      data.beds?.forEach((bed: unknown) => {
        transaction.objectStore(BEDS_STORE_NAME).add(bed);
      });

      data.placements?.forEach((placement: unknown) => {
        transaction.objectStore(PLACEMENTS_STORE_NAME).add(placement);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      db.close();
    } else {
      // Fallback to localStorage
      saveToLocalStorageFallback('patches', data.patches || []);
      saveToLocalStorageFallback('beds', data.beds || []);
      saveToLocalStorageFallback('placements', data.placements || []);
    }

    // Restore current patch
    if (data.currentPatchId) {
      saveToLocalStorageFallback('currentPatchId', data.currentPatchId);
    }

    storageLogger.info('Data imported successfully');
  } catch (error) {
    storageLogger.error('Failed to import data', error);
    throw error;
  }
};
