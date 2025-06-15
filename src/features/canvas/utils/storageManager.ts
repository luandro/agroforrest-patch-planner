/**
 * Unified storage manager for IndexedDB with localStorage fallback
 * Handles all database operations for patches, beds, and plant placements
 */

export const DB_NAME = 'AgroForestDB';
export const DB_VERSION = 4; // Incremented to force schema update
export const PATCHES_STORE_NAME = 'patches';
export const BEDS_STORE_NAME = 'beds';
export const PLACEMENTS_STORE_NAME = 'placements';

// Storage keys for localStorage fallback
const STORAGE_KEYS = {
  patches: 'agroforest_patches',
  beds: 'agroforest_beds',
  placements: 'agroforest_placements',
  currentPatchId: 'agroforest_current_patch_id'
} as const;

/**
 * Opens IndexedDB with proper schema management
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      const transaction = (event.target as IDBOpenDBRequest).transaction!;
      
      console.log('🔧 Upgrading database schema to version', DB_VERSION);
      
      // Create patches store
      if (!db.objectStoreNames.contains(PATCHES_STORE_NAME)) {
        const patchStore = db.createObjectStore(PATCHES_STORE_NAME, { keyPath: 'id' });
        patchStore.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('✅ Created patches store');
      }
      
      // Create beds store
      if (!db.objectStoreNames.contains(BEDS_STORE_NAME)) {
        const bedStore = db.createObjectStore(BEDS_STORE_NAME, { keyPath: 'id' });
        bedStore.createIndex('patchId', 'patchId', { unique: false });
        console.log('✅ Created beds store');
      }
      
      // Create placements store
      if (!db.objectStoreNames.contains(PLACEMENTS_STORE_NAME)) {
        const placementStore = db.createObjectStore(PLACEMENTS_STORE_NAME, { keyPath: 'id' });
        placementStore.createIndex('patchId', 'patchId', { unique: false });
        placementStore.createIndex('bedId', 'bedId', { unique: false });
        console.log('✅ Created placements store');
      }
      
      // Migration: Add patchId to existing placements if needed
      if (transaction && db.objectStoreNames.contains(PLACEMENTS_STORE_NAME)) {
        const placementStore = transaction.objectStore(PLACEMENTS_STORE_NAME);
        const bedStore = transaction.objectStore(BEDS_STORE_NAME);
        
        placementStore.openCursor().onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const placement = cursor.value;
            if (!placement.patchId && placement.bedId) {
              // Find the bed to get its patchId
              const bedRequest = bedStore.get(placement.bedId);
              bedRequest.onsuccess = () => {
                const bed = bedRequest.result;
                if (bed && bed.patchId) {
                  placement.patchId = bed.patchId;
                  cursor.update(placement);
                  console.log('🔄 Migrated placement', placement.id, 'to patch', bed.patchId);
                }
              };
            }
            cursor.continue();
          }
        };
      }
    };

    request.onsuccess = () => {
      console.log('✅ Database opened successfully');
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error('❌ Database error:', request.error);
      reject(new Error('Failed to open database'));
    };
    
    request.onblocked = () => {
      console.warn('⚠️ Database upgrade blocked. Please close other tabs.');
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
    console.warn('⚠️ IndexedDB not available, falling back to localStorage:', error);
    return false;
  }
};

/**
 * Save data to localStorage as fallback
 */
export const saveToLocalStorageFallback = <T>(key: keyof typeof STORAGE_KEYS, data: T): void => {
  try {
    const storageKey = STORAGE_KEYS[key];
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log('💾 Saved to localStorage fallback:', key, 'data length:', Array.isArray(data) ? data.length : 'N/A');
  } catch (error) {
    console.error('❌ Failed to save to localStorage:', error);
  }
};

/**
 * Load data from localStorage fallback
 */
export const loadFromLocalStorageFallback = <T>(key: keyof typeof STORAGE_KEYS, defaultValue: T): T => {
  try {
    const storageKey = STORAGE_KEYS[key];
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📂 Loaded from localStorage fallback:', key);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error);
  }
  return defaultValue;
};

/**
 * Clear all storage (both IndexedDB and localStorage)
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    // Clear IndexedDB
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
    
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 All storage cleared');
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
  }
};

/**
 * Upsert (insert or update) patches data efficiently
 */
export const upsertPatches = async (patches: unknown[]): Promise<void> => {
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
      console.log('✅ Patches upserted successfully:', patches.length);
    } else {
      // For localStorage, we still need to load all and merge
      const existing = loadFromLocalStorageFallback('patches', []);
      const patchMap = new Map(existing.map((p: unknown) => [(p as any).id, p]));
      
      // Update existing or add new
      patches.forEach(patch => {
        patchMap.set((patch as any).id, patch);
      });
      
      saveToLocalStorageFallback('patches', Array.from(patchMap.values()));
      console.log('✅ Patches upserted to localStorage:', patches.length);
    }
  } catch (error) {
    console.error('❌ Failed to upsert patches:', error);
    throw error;
  }
};

/**
 * Upsert beds data efficiently for a specific patch
 */
export const upsertBedsForPatch = async (patchId: string, beds: unknown[]): Promise<void> => {
  try {
    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([BEDS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(BEDS_STORE_NAME);
      
      // First, remove existing beds for this patch
      const index = store.index('patchId');
      const range = IDBKeyRange.only(patchId);
      const existingBedsRequest = index.getAll(range);
      
      const existingBeds = await new Promise<unknown[]>((resolve, reject) => {
        existingBedsRequest.onsuccess = () => resolve(existingBedsRequest.result || []);
        existingBedsRequest.onerror = () => reject(existingBedsRequest.error);
      });
      
      // Delete existing beds for this patch
      existingBeds.forEach(bed => {
        store.delete((bed as any).id);
      });
      
      // Add new beds with patch reference
      const bedsWithPatch = beds.map(bed => ({
        ...(bed as any),
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
      console.log('✅ Beds upserted successfully for patch:', patchId, 'count:', beds.length);
    } else {
      // For localStorage, load all beds and update
      const allBeds = loadFromLocalStorageFallback('beds', []);
      const otherPatchBeds = allBeds.filter((bed: unknown) => (bed as any).patchId !== patchId);
      const bedsWithPatch = beds.map(bed => ({ ...(bed as any), patchId }));
      
      saveToLocalStorageFallback('beds', [...otherPatchBeds, ...bedsWithPatch]);
      console.log('✅ Beds upserted to localStorage for patch:', patchId, 'count:', beds.length);
    }
  } catch (error) {
    console.error('❌ Failed to upsert beds:', error);
    throw error;
  }
};

/**
 * Upsert plant placements data efficiently for a specific patch
 */
export const upsertPlacementsForPatch = async (patchId: string, placements: unknown[]): Promise<void> => {
  try {
    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([PLACEMENTS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(PLACEMENTS_STORE_NAME);
      
      // First, remove existing placements for this patch
      const index = store.index('patchId');
      const range = IDBKeyRange.only(patchId);
      const existingPlacementsRequest = index.getAll(range);
      
      const existingPlacements = await new Promise<unknown[]>((resolve, reject) => {
        existingPlacementsRequest.onsuccess = () => resolve(existingPlacementsRequest.result || []);
        existingPlacementsRequest.onerror = () => reject(existingPlacementsRequest.error);
      });
      
      // Delete existing placements for this patch
      existingPlacements.forEach(placement => {
        store.delete((placement as any).id);
      });
      
      // Add new placements with patch reference
      const placementsWithPatch = placements.map(placement => ({
        ...(placement as any),
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
      console.log('✅ Placements upserted successfully for patch:', patchId, 'count:', placements.length);
    } else {
      // For localStorage, load all placements and update
      const allPlacements = loadFromLocalStorageFallback('placements', []);
      const otherPatchPlacements = allPlacements.filter((placement: unknown) => (placement as any).patchId !== patchId);
      const placementsWithPatch = placements.map(placement => ({ ...(placement as any), patchId }));
      
      saveToLocalStorageFallback('placements', [...otherPatchPlacements, ...placementsWithPatch]);
      console.log('✅ Placements upserted to localStorage for patch:', patchId, 'count:', placements.length);
    }
  } catch (error) {
    console.error('❌ Failed to upsert placements:', error);
    throw error;
  }
};

/**
 * Load data for a specific patch efficiently
 */
export const loadPatchData = async (patchId: string) => {
  try {
    let beds: unknown[] = [];
    let placements: unknown[] = [];
    
    if (await isIndexedDBAvailable()) {
      const db = await openDB();
      const transaction = db.transaction([BEDS_STORE_NAME, PLACEMENTS_STORE_NAME], 'readonly');
      
      // Load beds for patch
      const bedStore = transaction.objectStore(BEDS_STORE_NAME);
      const bedIndex = bedStore.index('patchId');
      const bedRange = IDBKeyRange.only(patchId);
      const bedRequest = bedIndex.getAll(bedRange);
      
      beds = await new Promise<unknown[]>((resolve, reject) => {
        bedRequest.onsuccess = () => resolve(bedRequest.result || []);
        bedRequest.onerror = () => reject(bedRequest.error);
      });
      
      // Load placements for patch
      const placementStore = transaction.objectStore(PLACEMENTS_STORE_NAME);
      const placementIndex = placementStore.index('patchId');
      const placementRange = IDBKeyRange.only(patchId);
      const placementRequest = placementIndex.getAll(placementRange);
      
      placements = await new Promise<unknown[]>((resolve, reject) => {
        placementRequest.onsuccess = () => resolve(placementRequest.result || []);
        placementRequest.onerror = () => reject(placementRequest.error);
      });
      
      db.close();
    } else {
      // Load from localStorage fallback
      const allBeds = loadFromLocalStorageFallback('beds', []);
      const allPlacements = loadFromLocalStorageFallback('placements', []);
      
      beds = allBeds.filter((bed: unknown) => (bed as any).patchId === patchId);
      placements = allPlacements.filter((placement: unknown) => (placement as any).patchId === patchId);
    }
    
    console.log('✅ Loaded patch data for:', patchId, 'beds:', beds.length, 'placements:', placements.length);
    return { beds, placements };
  } catch (error) {
    console.error('❌ Failed to load patch data:', error);
    throw error;
  }
};

/**
 * Export/import functionality for data backup
 */
export const exportAllData = async (): Promise<string> => {
  try {
    const data = {
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
      
      data.patches = patches;
      data.beds = beds;
      data.placements = placements;
      data.currentPatchId = localStorage.getItem(STORAGE_KEYS.currentPatchId);
      
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
    console.error('❌ Failed to export data:', error);
    throw error;
  }
};

/**
 * Import data from backup
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
      localStorage.setItem(STORAGE_KEYS.currentPatchId, data.currentPatchId);
    }
    
    console.log('✅ Data imported successfully');
  } catch (error) {
    console.error('❌ Failed to import data:', error);
    throw error;
  }
};
