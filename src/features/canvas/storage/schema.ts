/**
 * Database schema constants and storage keys
 */

export const DB_NAME = 'AgroForestDB';
export const DB_VERSION = 4;

// Object store names
export const PATCHES_STORE_NAME = 'patches';
export const BEDS_STORE_NAME = 'beds';
export const PLACEMENTS_STORE_NAME = 'placements';

// Storage keys for localStorage fallback
export const STORAGE_KEYS = {
  patches: 'agroforest_patches',
  beds: 'agroforest_beds',
  placements: 'agroforest_placements',
  currentPatchId: 'agroforest_current_patch_id'
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
