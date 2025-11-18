/**
 * Unified storage module for IndexedDB with localStorage fallback
 * Re-exports all storage functionality for backward compatibility
 */

// Schema constants
export {
  DB_NAME,
  DB_VERSION,
  PATCHES_STORE_NAME,
  BEDS_STORE_NAME,
  PLACEMENTS_STORE_NAME,
  STORAGE_KEYS,
  type StorageKey
} from './schema';

// Connection management
export {
  openDB,
  isIndexedDBAvailable
} from './connection';

// localStorage fallback
export {
  saveToLocalStorageFallback,
  loadFromLocalStorageFallback
} from './fallback';

// CRUD operations
export {
  clearAllStorage,
  upsertPatches,
  upsertBedsForPatch,
  upsertPlacementsForPatch,
  loadPatchData
} from './operations';

// Export/import
export {
  exportAllData,
  importAllData
} from './export';
