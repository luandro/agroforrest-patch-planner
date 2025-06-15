/**
 * Unified storage initialization hook
 * Ensures proper loading order: patches -> beds -> plants
 * Handles initialization state and coordination between stores
 */

import { useEffect, useRef, useState } from 'react';
import { usePatchStore } from '../stores/patchStore';
import { useBedStore } from '../stores/bedStore';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { 
  openDB, 
  loadFromLocalStorageFallback, 
  isIndexedDBAvailable,
  PATCHES_STORE_NAME,
  BEDS_STORE_NAME,
  PLACEMENTS_STORE_NAME
} from '../utils/storageManager';

interface StorageInitializationState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  patchesLoaded: boolean;
  bedsLoaded: boolean;
  plantsLoaded: boolean;
}

export const useStorageInitialization = () => {
  const [state, setState] = useState<StorageInitializationState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    patchesLoaded: false,
    bedsLoaded: false,
    plantsLoaded: false
  });

  const initializationRef = useRef(false);
  const { loadPatches, setCurrentPatch, createPatch, currentPatchId } = usePatchStore();
  const { loadBeds, beds } = useBedStore();
  const { loadPlacements } = usePlantPlacementStore();

  const initializeStorage = async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🚀 Starting storage initialization...');

      // Step 1: Initialize patches first
      await initializePatches();
      setState(prev => ({ ...prev, patchesLoaded: true }));

      // Step 2: Initialize beds for current patch
      await initializeBeds();
      setState(prev => ({ ...prev, bedsLoaded: true }));

      // Step 3: Initialize plants for current patch
      await initializePlants();
      setState(prev => ({ ...prev, plantsLoaded: true }));

      setState(prev => ({ 
        ...prev, 
        isInitialized: true, 
        isLoading: false 
      }));

      console.log('✅ Storage initialization completed successfully');
    } catch (error) {
      console.error('❌ Storage initialization failed:', error);
      initializationRef.current = false; // Reset flag to allow retry
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      }));
    }
  };

  const initializePatches = async () => {
    console.log('📦 Initializing patches...');
    
    let patches: any[] = [];
    
    // Try IndexedDB first, fallback to localStorage
    if (await isIndexedDBAvailable()) {
      try {
        const db = await openDB();
        
        if (db.objectStoreNames.contains(PATCHES_STORE_NAME)) {
          const transaction = db.transaction([PATCHES_STORE_NAME], 'readonly');
          const store = transaction.objectStore(PATCHES_STORE_NAME);
          
          patches = await new Promise<any[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
          });
        }
        
        db.close();
      } catch (error) {
        console.warn('⚠️ IndexedDB failed for patches, using localStorage:', error);
        patches = loadFromLocalStorageFallback('patches', []);
      }
    } else {
      patches = loadFromLocalStorageFallback('patches', []);
    }

    if (patches.length === 0) {
      console.log('🆕 No patches found, creating default patch...');
      const defaultPatchId = await createPatch({
        name: 'Meu Primeiro Canteiro',
        description: 'Canteiro principal para experimentos agroflorestais',
        size: { width: 20, height: 20 }
      });
      console.log('✅ Default patch created:', defaultPatchId);
    } else {
      loadPatches(patches, false);
      
      // Restore current patch
      const savedCurrentPatchId = localStorage.getItem('agroforest_current_patch_id');
      if (savedCurrentPatchId && patches.find(p => p.id === savedCurrentPatchId)) {
        setCurrentPatch(savedCurrentPatchId);
      } else {
        setCurrentPatch(patches[0].id);
      }
      
      console.log('✅ Patches loaded:', patches.length);
    }
  };

  const initializeBeds = async () => {
    console.log('🛏️ Initializing beds...');
    
    if (!currentPatchId) {
      console.log('⏭️ No current patch, skipping beds initialization');
      return;
    }

    let beds: any[] = [];
    
    // Try IndexedDB first, fallback to localStorage
    if (await isIndexedDBAvailable()) {
      try {
        const db = await openDB();
        
        if (db.objectStoreNames.contains(BEDS_STORE_NAME)) {
          const transaction = db.transaction([BEDS_STORE_NAME], 'readonly');
          const store = transaction.objectStore(BEDS_STORE_NAME);
          
          const allBeds = await new Promise<any[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
          });
          
          beds = allBeds.filter(bed => bed.patchId === currentPatchId);
        }
        
        db.close();
      } catch (error) {
        console.warn('⚠️ IndexedDB failed for beds, using localStorage:', error);
        const allBeds = loadFromLocalStorageFallback('beds', []);
        beds = allBeds.filter((bed: any) => bed.patchId === currentPatchId);
      }
    } else {
      const allBeds = loadFromLocalStorageFallback('beds', []);
      beds = allBeds.filter((bed: any) => bed.patchId === currentPatchId);
    }

    loadBeds(beds);
    console.log('✅ Beds loaded for patch:', currentPatchId, 'count:', beds.length);
  };

  const initializePlants = async () => {
    console.log('🌱 Initializing plants...');
    
    if (!currentPatchId) {
      console.log('⏭️ No current patch, skipping plants initialization');
      return;
    }

    let placements: any[] = [];
    const currentPatchBedIds = beds.map(bed => bed.id);
    
    // Try IndexedDB first, fallback to localStorage
    if (await isIndexedDBAvailable()) {
      try {
        const db = await openDB();
        
        if (db.objectStoreNames.contains(PLACEMENTS_STORE_NAME)) {
          const transaction = db.transaction([PLACEMENTS_STORE_NAME], 'readonly');
          const store = transaction.objectStore(PLACEMENTS_STORE_NAME);
          
          const allPlacements = await new Promise<any[]>((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
          });
          
          // Filter by both patchId and bedId for compatibility
          placements = allPlacements.filter(
            placement => placement.patchId === currentPatchId || currentPatchBedIds.includes(placement.bedId)
          );
        }
        
        db.close();
      } catch (error) {
        console.warn('⚠️ IndexedDB failed for placements, using localStorage:', error);
        const allPlacements = loadFromLocalStorageFallback('placements', []);
        placements = allPlacements.filter(
          (placement: any) => placement.patchId === currentPatchId || currentPatchBedIds.includes(placement.bedId)
        );
      }
    } else {
      const allPlacements = loadFromLocalStorageFallback('placements', []);
      placements = allPlacements.filter(
        (placement: any) => placement.patchId === currentPatchId || currentPatchBedIds.includes(placement.bedId)
      );
    }

    loadPlacements(placements);
    console.log('✅ Plants loaded for patch:', currentPatchId, 'count:', placements.length);
  };

  // Initialize on mount
  useEffect(() => {
    initializeStorage();
  }, []);

  // Re-initialize beds and plants when patch changes
  useEffect(() => {
    const unsubscribe = usePatchStore.subscribe(
      (state) => state.currentPatchId,
      (currentPatchId) => {
        if (state.isInitialized && currentPatchId) {
          console.log('🔄 Patch changed, re-initializing beds and plants for:', currentPatchId);
          initializeBeds().then(() => initializePlants());
        }
      }
    );

    return unsubscribe;
  }, [state.isInitialized]);

  return {
    ...state,
    reinitialize: initializeStorage
  };
};
