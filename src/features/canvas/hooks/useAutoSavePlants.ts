
import { useEffect, useRef, useState } from 'react';
import { usePlantPlacementStore, PlantPlacement } from '../stores/plantPlacementStore';
import { usePatchStore } from '../stores/patchStore';
import { useBedStore } from '../stores/bedStore';
import {
  upsertPlacementsForPatch,
  loadPatchData
} from '../storage';

interface UseAutoSavePlantsProps {
  debounceMs?: number;
}

export const useAutoSavePlants = ({ debounceMs = 5000 }: UseAutoSavePlantsProps = {}) => {
  const { placements, isDirty, markClean, loadPlacements } = usePlantPlacementStore();
  const { currentPatchId } = usePatchStore();
  const { beds } = useBedStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debug logging for hook initialization
  useEffect(() => {
    console.log('🔧 useAutoSavePlants hook initialized for patch:', currentPatchId);
  }, [currentPatchId]);

  const savePlacements = async () => {
    if (!isDirty || !currentPatchId) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      console.log('💾 Saving plant placements to storage for patch:', currentPatchId, 'placements count:', placements.length);

      // Use optimized upsert operation for current patch
      await upsertPlacementsForPatch(currentPatchId, placements);

      markClean();
      console.log('✅ Plant placements saved successfully for patch:', currentPatchId);
    } catch (error) {
      console.error('❌ Failed to save plant placements:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPlacementsFromStorage = async () => {
    if (!currentPatchId) return;

    try {
      console.log('📂 Loading plant placements from storage for patch:', currentPatchId);

      // Use optimized patch data loading
      const { placements: patchPlacements } = await loadPatchData(currentPatchId);
      loadPlacements(patchPlacements as PlantPlacement[]);
      console.log('✅ Plant placements loaded successfully for patch:', currentPatchId, 'count:', patchPlacements.length);
    } catch (error) {
      console.error('❌ Failed to load plant placements:', error);
      loadPlacements([]);
    }
  };

  useEffect(() => {
    if (!isDirty) return;

    console.log('⏰ Scheduling plant placements auto-save in', debounceMs, 'ms for patch:', currentPatchId);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      savePlacements();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, placements, debounceMs, currentPatchId]);

  // Load placements when patch changes or beds change
  useEffect(() => {
    if (currentPatchId && beds.length >= 0) {
      loadPlacementsFromStorage();
    } else {
      loadPlacements([]);
    }
  }, [currentPatchId, beds]);

  const manualSave = async (): Promise<void> => {
    console.log('🔧 Manual plant placements save triggered for patch:', currentPatchId);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return await savePlacements();
  };

  return {
    isSaving,
    saveError,
    manualSave
  };
};
