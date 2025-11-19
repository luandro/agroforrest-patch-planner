/**
 * Database CRUD operations for patches, beds, and placements
 */
import { Patch } from '../types/patch.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { storageLogger } from '@/lib/logger';
import {
  PATCHES_STORE_NAME,
  BEDS_STORE_NAME,
  PLACEMENTS_STORE_NAME,
  STORAGE_KEYS
} from './schema';
import { openDB, isIndexedDBAvailable } from './connection';
import { saveToLocalStorageFallback, loadFromLocalStorageFallback } from './fallback';

/**
 * Clear all storage (both IndexedDB and localStorage)
 */
export const clearAllStorage = async (): Promise<void> => {
  const errors: Error[] = [];

  // Always attempt both, collect errors
  try {
    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([PATCHES_STORE_NAME, BEDS_STORE_NAME, PLACEMENTS_STORE_NAME], 'readwrite');

      transaction.objectStore(PATCHES_STORE_NAME).clear();
      transaction.objectStore(BEDS_STORE_NAME).clear();
      transaction.objectStore(PLACEMENTS_STORE_NAME).clear();

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      db.close();
    }
  } catch (error) {
    errors.push(error instanceof Error ? error : new Error('IndexedDB clear failed'));
  }

  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    errors.push(error instanceof Error ? error : new Error('localStorage clear failed'));
  }

  if (errors.length > 0) {
    throw new Error(`Storage clearing failed: ${errors.map(e => e.message).join(', ')}`);
  }

  storageLogger.info('All storage cleared');
};

/**
 * Upsert (insert or update) patches data efficiently
 */
export const upsertPatches = async (patches: Patch[]): Promise<void> => {
  try {
    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([PATCHES_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(PATCHES_STORE_NAME);

      // Use put() for upsert operation (insert or update)
      patches.forEach(patch => {
        store.put(patch);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      db.close();
      storageLogger.info(`Patches upserted successfully: ${patches.length}`);
    } else {
      // For localStorage, we still need to load all and merge
      const existing = loadFromLocalStorageFallback<Patch[]>('patches', []);
      const patchMap = new Map(existing.map((p) => [p.id, p] as const));

      // Update existing or add new
      patches.forEach(patch => {
        patchMap.set(patch.id, patch);
      });

      saveToLocalStorageFallback('patches', Array.from(patchMap.values()));
      storageLogger.info(`Patches upserted to localStorage: ${patches.length}`);
    }
  } catch (error) {
    storageLogger.error('Failed to upsert patches', error);
    throw error;
  }
};

/**
 * Upsert beds data efficiently for a specific patch
 */
export const upsertBedsForPatch = async (patchId: string, beds: Bed[]): Promise<void> => {
  try {
    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([BEDS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(BEDS_STORE_NAME);

      // First, remove existing beds for this patch
      const index = store.index('patchId');
      const range = IDBKeyRange.only(patchId);
      const existingBedsRequest = index.getAll(range);

      const existingBeds = await new Promise<Bed[]>((resolve, reject) => {
        existingBedsRequest.onsuccess = () => resolve(existingBedsRequest.result || []);
        existingBedsRequest.onerror = () => reject(existingBedsRequest.error);
      });

      // Delete existing beds for this patch
      existingBeds.forEach(bed => {
        store.delete(bed.id);
      });

      // Add new beds with patch reference
      const bedsWithPatch = beds.map(bed => ({
        ...bed,
        patchId
      }));

      bedsWithPatch.forEach(bed => {
        store.put(bed);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      db.close();
      storageLogger.info(`Beds upserted successfully for patch: ${patchId}, count: ${beds.length}`);
    } else {
      // For localStorage, load all beds and update
      const allBeds = loadFromLocalStorageFallback<Bed[]>('beds', []);
      const otherPatchBeds = allBeds.filter((bed) => bed.patchId !== patchId);
      const bedsWithPatch = beds.map(bed => ({ ...bed, patchId }));

      saveToLocalStorageFallback('beds', [...otherPatchBeds, ...bedsWithPatch]);
      storageLogger.info(`Beds upserted to localStorage for patch: ${patchId}, count: ${beds.length}`);
    }
  } catch (error) {
    storageLogger.error('Failed to upsert beds', error);
    throw error;
  }
};

/**
 * Upsert plant placements data efficiently for a specific patch
 */
export const upsertPlacementsForPatch = async (patchId: string, placements: PlantPlacement[]): Promise<void> => {
  try {
    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([PLACEMENTS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(PLACEMENTS_STORE_NAME);

      // First, remove existing placements for this patch
      const index = store.index('patchId');
      const range = IDBKeyRange.only(patchId);
      const existingPlacementsRequest = index.getAll(range);

      const existingPlacements = await new Promise<PlantPlacement[]>((resolve, reject) => {
        existingPlacementsRequest.onsuccess = () => resolve(existingPlacementsRequest.result || []);
        existingPlacementsRequest.onerror = () => reject(existingPlacementsRequest.error);
      });

      // Delete existing placements for this patch
      existingPlacements.forEach(placement => {
        store.delete(placement.id);
      });

      // Add new placements with patch reference
      const placementsWithPatch = placements.map(placement => ({
        ...placement,
        patchId
      }));

      placementsWithPatch.forEach(placement => {
        store.put(placement);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      db.close();
      storageLogger.info(`Placements upserted successfully for patch: ${patchId}, count: ${placements.length}`);
    } else {
      // For localStorage, load all placements and update
      const allPlacements = loadFromLocalStorageFallback<PlantPlacement[]>('placements', []);
      const otherPatchPlacements = allPlacements.filter((placement) => placement.patchId !== patchId);
      const placementsWithPatch = placements.map(placement => ({ ...placement, patchId }));

      saveToLocalStorageFallback('placements', [...otherPatchPlacements, ...placementsWithPatch]);
      storageLogger.info(`Placements upserted to localStorage for patch: ${patchId}, count: ${placements.length}`);
    }
  } catch (error) {
    storageLogger.error('Failed to upsert placements', error);
    throw error;
  }
};

/**
 * Load data for a specific patch efficiently
 */
export const loadPatchData = async (patchId: string): Promise<{ beds: Bed[]; placements: PlantPlacement[] }> => {
  try {
    let beds: Bed[] = [];
    let placements: PlantPlacement[] = [];

    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([BEDS_STORE_NAME, PLACEMENTS_STORE_NAME], 'readonly');

      // Load beds for patch
      const bedStore = transaction.objectStore(BEDS_STORE_NAME);
      const bedIndex = bedStore.index('patchId');
      const bedRange = IDBKeyRange.only(patchId);
      const bedRequest = bedIndex.getAll(bedRange);

      beds = await new Promise<Bed[]>((resolve, reject) => {
        bedRequest.onsuccess = () => resolve(bedRequest.result || []);
        bedRequest.onerror = () => reject(bedRequest.error);
      });

      // Load placements for patch
      const placementStore = transaction.objectStore(PLACEMENTS_STORE_NAME);
      const placementIndex = placementStore.index('patchId');
      const placementRange = IDBKeyRange.only(patchId);
      const placementRequest = placementIndex.getAll(placementRange);

      placements = await new Promise<PlantPlacement[]>((resolve, reject) => {
        placementRequest.onsuccess = () => resolve(placementRequest.result || []);
        placementRequest.onerror = () => reject(placementRequest.error);
      });

      db.close();
    } else {
      // Load from localStorage fallback
      const allBeds = loadFromLocalStorageFallback<Bed[]>('beds', []);
      const allPlacements = loadFromLocalStorageFallback<PlantPlacement[]>('placements', []);

      beds = allBeds.filter((bed) => bed.patchId === patchId);
      placements = allPlacements.filter((placement) => placement.patchId === patchId);
    }

    storageLogger.info(`Loaded patch data for: ${patchId}, beds: ${beds.length}, placements: ${placements.length}`);
    return { beds, placements };
  } catch (error) {
    storageLogger.error('Failed to load patch data', error);
    throw error;
  }
};
