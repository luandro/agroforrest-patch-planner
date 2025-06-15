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

  // Manual save all with proper order and optimized operations
  const manualSaveAll = async () => {
    if (!storageInit.isInitialized) {
      console.warn('⚠️ Storage not initialized, cannot save');
      return;
    }

    console.log('🔧 Manual save all triggered');
    
    try {
      const savePromises: Promise<void>[] = [];
      
      // Direct async save operations with proper error handling
      if (patchesDirty) {
        console.log('💾 Saving patches...');
        savePromises.push(
          patchAutoSave.manualSave()
            .then(() => {
              setState(prev => ({
                ...prev,
                saveCounts: { ...prev.saveCounts, patches: prev.saveCounts.patches + 1 }
              }));
              console.log('✅ Patches saved successfully');
            })
            .catch((error) => {
              console.error('❌ Failed to save patches:', error);
              throw error;
            })
        );
      }

      if (bedsDirty) {
        console.log('💾 Saving beds...');
        savePromises.push(
          bedAutoSave.manualSave()
            .then(() => {
              setState(prev => ({
                ...prev,
                saveCounts: { ...prev.saveCounts, beds: prev.saveCounts.beds + 1 }
              }));
              console.log('✅ Beds saved successfully');
            })
            .catch((error) => {
              console.error('❌ Failed to save beds:', error);
              throw error;
            })
        );
      }

      if (plantsDirty) {
        console.log('💾 Saving plants...');
        savePromises.push(
          plantAutoSave.manualSave()
            .then(() => {
              setState(prev => ({
                ...prev,
                saveCounts: { ...prev.saveCounts, plants: prev.saveCounts.plants + 1 }
              }));
              console.log('✅ Plants saved successfully');
            })
            .catch((error) => {
              console.error('❌ Failed to save plants:', error);
              throw error;
            })
        );
      }

      // Wait for all save operations to complete with timeout
      if (savePromises.length > 0) {
        await Promise.race([
          Promise.all(savePromises),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Save operation timeout')), 15000)
          )
        ]);
      }

      setState(prev => ({
        ...prev,
        lastSaveTime: Date.now()
      }));

      console.log('✅ Manual save all completed');
    } catch (error) {
      console.error('❌ Manual save all failed:', error);
      // Don't throw - we want graceful degradation
      setState(prev => ({
        ...prev,
        saveErrors: [...prev.saveErrors, error instanceof Error ? error.message : 'Save failed']
      }));
    }
  };

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (patchesDirty || bedsDirty || plantsDirty) {
        // Trigger immediate saves
        patchAutoSave.manualSave();
        bedAutoSave.manualSave();
        plantAutoSave.manualSave();
        
        // Show warning to user
        event.preventDefault();
        event.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [patchesDirty, bedsDirty, plantsDirty]);

  // Periodic save for safety (every 10 seconds if dirty for testing)
  useEffect(() => {
    if (!storageInit.isInitialized) return;

    const interval = setInterval(() => {
      if (patchesDirty || bedsDirty || plantsDirty) {
        console.log('⏰ Periodic save triggered');
        manualSaveAll();
      }
    }, 10000); // 10 seconds for testing

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
