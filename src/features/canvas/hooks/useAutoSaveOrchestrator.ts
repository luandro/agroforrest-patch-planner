/**
 * Auto-save orchestrator that coordinates all storage operations
 * Ensures proper saving order and prevents race conditions
 */

import { useEffect, useRef, useState } from 'react';
import { useAutoSave } from './useAutoSave';
import { useAutoSavePlants } from './useAutoSavePlants';
import { useAutoSavePatches } from './useAutoSavePatches';
import { useStorageInitialization } from './useStorageInitialization';
import { usePatchStore } from '../stores/patchStore';
import { useBedStore } from '../stores/bedStore';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

interface AutoSaveOrchestratorState {
  isInitialized: boolean;
  isSaving: boolean;
  lastSaveTime: number | null;
  saveErrors: string[];
  saveCounts: {
    patches: number;
    beds: number;
    plants: number;
  };
}

export const useAutoSaveOrchestrator = () => {
  const [state, setState] = useState<AutoSaveOrchestratorState>({
    isInitialized: false,
    isSaving: false,
    lastSaveTime: null,
    saveErrors: [],
    saveCounts: {
      patches: 0,
      beds: 0,
      plants: 0
    }
  });

  // Initialize storage first
  const storageInit = useStorageInitialization();

  // Auto-save hooks (always active, but with longer debounce during initialization)
  const patchAutoSave = useAutoSavePatches({
    debounceMs: storageInit.isInitialized ? 1000 : 5000
  });
  const bedAutoSave = useAutoSave({
    debounceMs: storageInit.isInitialized ? 1500 : 5000
  });
  const plantAutoSave = useAutoSavePlants({
    debounceMs: storageInit.isInitialized ? 2000 : 5000
  });

  // Store states for monitoring
  const { isDirty: patchesDirty } = usePatchStore();
  const { isDirty: bedsDirty } = useBedStore();
  const { isDirty: plantsDirty } = usePlantPlacementStore();

  // Track initialization state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isInitialized: storageInit.isInitialized
    }));
  }, [storageInit.isInitialized]);

  // Track saving state
  useEffect(() => {
    const isSaving = patchAutoSave.isSaving || bedAutoSave.isSaving || plantAutoSave.isSaving;
    setState(prev => ({
      ...prev,
      isSaving
    }));
  }, [patchAutoSave.isSaving, bedAutoSave.isSaving, plantAutoSave.isSaving]);

  // Track save errors
  useEffect(() => {
    const errors = [
      patchAutoSave.saveError,
      bedAutoSave.saveError,
      plantAutoSave.saveError
    ].filter(Boolean) as string[];

    setState(prev => ({
      ...prev,
      saveErrors: errors
    }));
  }, [patchAutoSave.saveError, bedAutoSave.saveError, plantAutoSave.saveError]);

  // Manual save all with proper order
  const manualSaveAll = async () => {
    if (!storageInit.isInitialized) {
      console.warn('⚠️ Storage not initialized, cannot save');
      return;
    }

    console.log('🔧 Manual save all triggered');
    
    try {
      // Save in order: patches -> beds -> plants
      if (patchesDirty) {
        await new Promise<void>((resolve, reject) => {
          patchAutoSave.manualSave();
          const timeout = setTimeout(() => reject(new Error('Patches save timeout')), 10000);
          let attempts = 0;
          const maxAttempts = 100; // 10 seconds maximum
          
          const checkSave = () => {
            if (!patchAutoSave.isSaving) {
              clearTimeout(timeout);
              resolve();
            } else if (patchAutoSave.saveError) {
              clearTimeout(timeout);
              reject(new Error(patchAutoSave.saveError));
            } else if (attempts >= maxAttempts) {
              clearTimeout(timeout);
              reject(new Error('Patches save timeout after maximum attempts'));
            } else {
              attempts++;
              setTimeout(checkSave, 100);
            }
          };
          checkSave();
        });
        
        setState(prev => ({
          ...prev,
          saveCounts: { ...prev.saveCounts, patches: prev.saveCounts.patches + 1 }
        }));
      }

      if (bedsDirty) {
        await new Promise<void>((resolve, reject) => {
          bedAutoSave.manualSave();
          const timeout = setTimeout(() => reject(new Error('Beds save timeout')), 10000);
          let attempts = 0;
          const maxAttempts = 100; // 10 seconds maximum
          
          const checkSave = () => {
            if (!bedAutoSave.isSaving) {
              clearTimeout(timeout);
              resolve();
            } else if (bedAutoSave.saveError) {
              clearTimeout(timeout);
              reject(new Error(bedAutoSave.saveError));
            } else if (attempts >= maxAttempts) {
              clearTimeout(timeout);
              reject(new Error('Beds save timeout after maximum attempts'));
            } else {
              attempts++;
              setTimeout(checkSave, 100);
            }
          };
          checkSave();
        });
        
        setState(prev => ({
          ...prev,
          saveCounts: { ...prev.saveCounts, beds: prev.saveCounts.beds + 1 }
        }));
      }

      if (plantsDirty) {
        await new Promise<void>((resolve, reject) => {
          plantAutoSave.manualSave();
          const timeout = setTimeout(() => reject(new Error('Plants save timeout')), 10000);
          let attempts = 0;
          const maxAttempts = 100; // 10 seconds maximum
          
          const checkSave = () => {
            if (!plantAutoSave.isSaving) {
              clearTimeout(timeout);
              resolve();
            } else if (plantAutoSave.saveError) {
              clearTimeout(timeout);
              reject(new Error(plantAutoSave.saveError));
            } else if (attempts >= maxAttempts) {
              clearTimeout(timeout);
              reject(new Error('Plants save timeout after maximum attempts'));
            } else {
              attempts++;
              setTimeout(checkSave, 100);
            }
          };
          checkSave();
        });
        
        setState(prev => ({
          ...prev,
          saveCounts: { ...prev.saveCounts, plants: prev.saveCounts.plants + 1 }
        }));
      }

      setState(prev => ({
        ...prev,
        lastSaveTime: Date.now()
      }));

      console.log('✅ Manual save all completed');
    } catch (error) {
      console.error('❌ Manual save all failed:', error);
      setState(prev => ({
        ...prev,
        saveErrors: [...prev.saveErrors, error instanceof Error ? error.message : 'Unknown error']
      }));
    }
  };

  // Store references for direct access
  const patchStore = usePatchStore;
  const bedStore = useBedStore;
  const plantStore = usePlantPlacementStore;

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (patchesDirty || bedsDirty || plantsDirty) {
        // Attempt synchronous save using localStorage as last resort
        try {
          if (patchesDirty) {
            const { patches } = patchStore.getState();
            localStorage.setItem('agroforest_patches', JSON.stringify(patches));
          }
          if (bedsDirty) {
            const { beds } = bedStore.getState();
            localStorage.setItem('agroforest_beds', JSON.stringify(beds));
          }
          if (plantsDirty) {
            const { placements } = plantStore.getState();
            localStorage.setItem('agroforest_placements', JSON.stringify(placements));
          }
          
          console.log('🚨 Emergency save completed before unload');
        } catch (error) {
          console.error('Emergency save failed:', error);
        }
        
        // Show warning to user
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [patchesDirty, bedsDirty, plantsDirty, patchStore, bedStore, plantStore]);

  // Adaptive periodic save for safety
  useEffect(() => {
    if (!storageInit.isInitialized) return;

    // Adaptive interval based on data size and user activity
    const getSaveInterval = () => {
      const dirtyCount = (patchesDirty ? 1 : 0) + (bedsDirty ? 1 : 0) + (plantsDirty ? 1 : 0);
      return Math.max(30000, dirtyCount * 10000); // 30s minimum, +10s per dirty store
    };

    const interval = setInterval(() => {
      if (patchesDirty || bedsDirty || plantsDirty) {
        console.log('⏰ Periodic save triggered');
        manualSaveAll();
      }
    }, getSaveInterval());

    return () => clearInterval(interval);
  }, [storageInit.isInitialized, patchesDirty, bedsDirty, plantsDirty]);

  // Clear errors after some time
  useEffect(() => {
    if (state.saveErrors.length > 0) {
      const timeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          saveErrors: []
        }));
      }, 10000); // Clear errors after 10 seconds

      return () => clearTimeout(timeout);
    }
  }, [state.saveErrors]);

  // Debug logging
  useEffect(() => {
    if (storageInit.isInitialized) {
      console.log('🔧 Auto-save orchestrator initialized');
      console.log('📊 Dirty states:', { patchesDirty, bedsDirty, plantsDirty });
    }
  }, [storageInit.isInitialized, patchesDirty, bedsDirty, plantsDirty]);

  return {
    // Initialization state
    isInitialized: storageInit.isInitialized,
    isLoading: storageInit.isLoading,
    initializationError: storageInit.error,
    
    // Save state
    isSaving: state.isSaving,
    lastSaveTime: state.lastSaveTime,
    saveErrors: state.saveErrors,
    saveCounts: state.saveCounts,
    
    // Dirty states
    isDirty: patchesDirty || bedsDirty || plantsDirty,
    patchesDirty,
    bedsDirty,
    plantsDirty,
    
    // Actions
    manualSaveAll,
    reinitialize: storageInit.reinitialize,
    
    // Individual save functions
    savePatchesManually: patchAutoSave.manualSave,
    saveBedsManually: bedAutoSave.manualSave,
    savePlantsManually: plantAutoSave.manualSave,
    
    // Storage initialization details
    storageDetails: {
      patchesLoaded: storageInit.patchesLoaded,
      bedsLoaded: storageInit.bedsLoaded,
      plantsLoaded: storageInit.plantsLoaded
    }
  };
};
