/**
 * Simple storage test that can be run in the browser console
 * Use this to verify that the storage system is working correctly
 */

import { 
  openDB, 
  saveToLocalStorageFallback, 
  loadFromLocalStorageFallback,
  BEDS_STORE_NAME,
  PATCHES_STORE_NAME,
  PLACEMENTS_STORE_NAME
} from './storageManager';
import { Patch } from '../types/patch.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';

interface StorageTestAPI {
  testLocalStorageFallback: () => ReturnType<typeof testLocalStorageFallback>;
  testIndexedDB: () => ReturnType<typeof testIndexedDB>;
  runStorageTests: () => ReturnType<typeof runStorageTests>;
  clearTestData: () => ReturnType<typeof clearTestData>;
}

declare global {
  interface Window {
    storageTest?: StorageTestAPI;
  }
}

// Test data
const testPatch: Patch = {
  id: 'test-patch-1',
  name: 'Test Patch',
  description: 'Test patch for storage verification',
  size: { width: 10, height: 10 },
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastViewport: { zoom: 1, centerX: 0, centerY: 0 }
};

const testBed: Bed = {
  id: 'test-bed-1',
  patchId: 'test-patch-1',
  shape: 'rectangle',
  position: { x: 0, y: 0 },
  dimensions: { length: 5, width: 3 },
  rotation: 0,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

const testPlacement: PlantPlacement = {
  id: 'test-placement-1',
  bedId: 'test-bed-1',
  patchId: 'test-patch-1',
  species: {
    id: 'test-species',
    commonName: 'Test Plant',
    scientificName: 'Testus plantus',
    category: 'trees',
    companionCompatibility: 'high',
    matureSize: { height: 3, width: 2 },
    spacing: { min: 1, max: 2 },
    description: 'Demo species',
    growthRate: 'medium',
    sunRequirement: 'full',
    waterRequirement: 'medium'
  },
  position: { x: 1, y: 1 },
  notes: 'Test placement'
};

/**
 * Test localStorage fallback functionality
 */
export const testLocalStorageFallback = () => {
  console.log('🧪 Testing localStorage fallback...');
  
  try {
    // Test saving
    saveToLocalStorageFallback('patches', [testPatch]);
    saveToLocalStorageFallback('beds', [testBed]);
    saveToLocalStorageFallback('placements', [testPlacement]);
    
    // Test loading
    const loadedPatches = loadFromLocalStorageFallback<Patch[]>('patches', []);
    const loadedBeds = loadFromLocalStorageFallback<Bed[]>('beds', []);
    const loadedPlacements = loadFromLocalStorageFallback<PlantPlacement[]>('placements', []);
    
    console.log('✅ localStorage test results:', {
      patches: loadedPatches,
      beds: loadedBeds,
      placements: loadedPlacements
    });
    
    return {
      success: true,
      patches: loadedPatches.length,
      beds: loadedBeds.length,
      placements: loadedPlacements.length
    };
  } catch (error) {
    console.error('❌ localStorage test failed:', error);
    return { success: false, error };
  }
};

/**
 * Test IndexedDB functionality
 */
export const testIndexedDB = async () => {
  console.log('🧪 Testing IndexedDB...');
  
  try {
    const db = await openDB();
    console.log('✅ IndexedDB opened successfully');
    
    // Test saving to IndexedDB
    const transaction = db.transaction([PATCHES_STORE_NAME, BEDS_STORE_NAME, PLACEMENTS_STORE_NAME], 'readwrite');
    
    transaction.objectStore(PATCHES_STORE_NAME).add(testPatch);
    transaction.objectStore(BEDS_STORE_NAME).add(testBed);
    transaction.objectStore(PLACEMENTS_STORE_NAME).add(testPlacement);
    
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    
    console.log('✅ Data saved to IndexedDB');
    
    // Test loading from IndexedDB
    const readTransaction = db.transaction([PATCHES_STORE_NAME, BEDS_STORE_NAME, PLACEMENTS_STORE_NAME], 'readonly');
    
    const [patches, beds, placements] = await Promise.all([
      new Promise<Patch[]>((resolve, reject) => {
        const request = readTransaction.objectStore(PATCHES_STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      }),
      new Promise<Bed[]>((resolve, reject) => {
        const request = readTransaction.objectStore(BEDS_STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      }),
      new Promise<PlantPlacement[]>((resolve, reject) => {
        const request = readTransaction.objectStore(PLACEMENTS_STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      })
    ]);
    
    console.log('✅ IndexedDB test results:', { patches, beds, placements });
    
    db.close();
    
    return {
      success: true,
      patches: patches.length,
      beds: beds.length,
      placements: placements.length
    };
  } catch (error) {
    console.error('❌ IndexedDB test failed:', error);
    return { success: false, error };
  }
};

/**
 * Run all storage tests
 */
export const runStorageTests = async () => {
  console.log('🚀 Running storage tests...');
  
  const localStorageResult = testLocalStorageFallback();
  const indexedDBResult = await testIndexedDB();
  
  const results = {
    localStorage: localStorageResult,
    indexedDB: indexedDBResult,
    overall: localStorageResult.success && indexedDBResult.success
  };
  
  console.log('📊 Storage test summary:', results);
  
  return results;
};

/**
 * Clear test data
 */
export const clearTestData = async () => {
  console.log('🧹 Clearing test data...');
  
  try {
    // Clear localStorage
    localStorage.removeItem('agroforest_patches');
    localStorage.removeItem('agroforest_beds');
    localStorage.removeItem('agroforest_placements');
    
    // Clear IndexedDB
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
    
    console.log('✅ Test data cleared');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to clear test data:', error);
    return { success: false, error };
  }
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.storageTest = {
    testLocalStorageFallback,
    testIndexedDB,
    runStorageTests,
    clearTestData
  };
  
  console.log('🧪 Storage test functions available at window.storageTest');
}
