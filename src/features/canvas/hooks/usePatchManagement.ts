
import { useEffect, useRef } from 'react';
import { usePatchStore } from '../stores/patchStore';
import { useAutoSavePatches } from './useAutoSavePatches';
import { useAutoSaveBeds } from './useAutoSaveBeds';
import { useAutoSavePlants } from './useAutoSavePlants';

/**
 * This hook orchestrates the entire patch system loading process.
 * It should be used once at the top level of the application, e.g., in PatchCreatorPage.
 */
export const usePatchManagement = () => {
  // Initialize all auto-save hooks to register their IndexedDB operations and load data
  useAutoSavePatches();
  useAutoSaveBeds();
  useAutoSavePlants();

  const { patches, activePatchId, addPatch, setActivePatchId, isLoaded } = usePatchStore();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isLoaded && !isInitialized.current) {
      isInitialized.current = true;
      if (patches.length === 0) {
        // Create a default patch if none exist
        const newPatchId = addPatch({ name: 'Meu Primeiro Canteiro' });
        setActivePatchId(newPatchId);
      } else if (!activePatchId) {
        // If patches exist but none are active, activate the first one
        setActivePatchId(patches[0].id);
      }
    }
  }, [isLoaded, patches, activePatchId, addPatch, setActivePatchId]);
};
