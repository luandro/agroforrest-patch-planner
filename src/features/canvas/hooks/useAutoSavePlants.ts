
import { useEffect, useRef, useState } from 'react';
import { usePlantPlacementStore, PlantPlacement } from '../stores/plantPlacementStore';
import { usePatchStore } from '../stores/patchStore';
import { useBedStore } from '../stores/bedStore';
import {
  openDB,
  saveToLocalStorageFallback,
  loadFromLocalStorageFallback,
  PLACEMENTS_STORE_NAME
} from '../utils/storageManager';

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

      // Try IndexedDB first, fallback to localStorage
      try {
        const db = await openDB();
        const transaction = db.transaction([PLACEMENTS_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(PLACEMENTS_STORE_NAME);

        // Get all existing placements
        const getAllRequest = store.getAll();
        const allPlacements = await new Promise<PlantPlacement[]>((resolve, reject) => {
          getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
          getAllRequest.onerror = () => reject(new Error('Failed to get existing placements'));
        });

        // Filter out placements from current patch (using both patchId and bedId for compatibility)
        const currentPatchBedIds = beds.map(bed => bed.id);
        const otherPatchPlacements = allPlacements.filter(
          placement => placement.patchId !== currentPatchId && !currentPatchBedIds.includes(placement.bedId)
        );

        // Clear store and add all placements
        store.clear();

        // Add placements from other patches
        otherPatchPlacements.forEach(placement => {
          store.add(placement);
        });

        // Add current patch placements with patch ID
        const placementsWithPatch = placements.map(placement => ({
          ...placement,
          patchId: currentPatchId
        }));

        placementsWithPatch.forEach(placement => {
          store.add(placement);
        });

        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => {
            console.error('Transaction error:', transaction.error);
            reject(new Error('Failed to save placements'));
          };
        });

        db.close();
      } catch (indexedDBError) {
        console.warn('⚠️ IndexedDB failed, using localStorage fallback:', indexedDBError);

        // Load existing placements from localStorage
        const existingPlacements = loadFromLocalStorageFallback('placements', []);
        const currentPatchBedIds = beds.map(bed => bed.id);
        const otherPatchPlacements = existingPlacements.filter(
          (placement: any) => placement.patchId !== currentPatchId && !currentPatchBedIds.includes(placement.bedId)
        );

        // Add current patch placements with patch ID
        const placementsWithPatch = placements.map(placement => ({
          ...placement,
          patchId: currentPatchId
        }));

        const allPlacements = [...otherPatchPlacements, ...placementsWithPatch];
        saveToLocalStorageFallback('placements', allPlacements);
      }

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

      // Try IndexedDB first, fallback to localStorage
      try {
        const db = await openDB();
        if (!db.objectStoreNames.contains(PLACEMENTS_STORE_NAME)) {
          console.log('🆕 Placements store does not exist yet. It will be created.');
          loadPlacements([]);
          db.close();
          return;
        }

        const transaction = db.transaction([PLACEMENTS_STORE_NAME], 'readonly');
        const store = transaction.objectStore(PLACEMENTS_STORE_NAME);
        const getAllRequest = store.getAll();

        const allPlacements = await new Promise<PlantPlacement[]>((resolve, reject) => {
          getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
          getAllRequest.onerror = () => {
             console.error('Get all request error:', getAllRequest.error);
             reject(new Error('Failed to load placements'));
          }
        });

        // Get current patch bed IDs for compatibility
        const currentPatchBedIds = beds.map(bed => bed.id);

        // Filter placements for current patch (using both patchId and bedId for compatibility)
        const patchPlacements = allPlacements.filter(
          placement => placement.patchId === currentPatchId || currentPatchBedIds.includes(placement.bedId)
        );

        loadPlacements(patchPlacements);
        console.log('✅ Plant placements loaded successfully for patch:', currentPatchId, 'count:', patchPlacements.length);

        db.close();
      } catch (indexedDBError) {
        console.warn('⚠️ IndexedDB failed, using localStorage fallback:', indexedDBError);

        // Load from localStorage fallback
        const allPlacements = loadFromLocalStorageFallback('placements', []);
        const currentPatchBedIds = beds.map(bed => bed.id);
        const patchPlacements = allPlacements.filter(
          (placement: any) => placement.patchId === currentPatchId || currentPatchBedIds.includes(placement.bedId)
        );

        loadPlacements(patchPlacements);
        console.log('✅ Plant placements loaded from localStorage for patch:', currentPatchId, 'count:', patchPlacements.length);
      }
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

  const manualSave = () => {
    console.log('🔧 Manual plant placements save triggered for patch:', currentPatchId);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    savePlacements();
  };

  return {
    isSaving,
    saveError,
    manualSave
  };
};
