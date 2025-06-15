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
                      console.log('🔄 Migrated placement', placement.id, 'to patch', bed.patchId);
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
              console.log('🔄 Migration completed successfully');
            }).catch((error) => {
              console.error('❌ Migration failed:', error);
            });
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
  
  console.log('🧹 All storage cleared');
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
        new Promise<any[]>((resolve, reject) => {
          const request = transaction.objectStore(PATCHES_STORE_NAME).getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        }),
        new Promise<any[]>((resolve, reject) => {
          const request = transaction.objectStore(BEDS_STORE_NAME).getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        }),
        new Promise<any[]>((resolve, reject) => {
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
      data.patches?.forEach((patch: any) => {
        transaction.objectStore(PATCHES_STORE_NAME).add(patch);
      });
      
      data.beds?.forEach((bed: any) => {
        transaction.objectStore(BEDS_STORE_NAME).add(bed);
      });
      
      data.placements?.forEach((placement: any) => {
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
