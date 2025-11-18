
import { useEffect, useRef, useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { usePatchStore } from '../stores/patchStore';
import { Bed } from '../types/bed.types';
import {
  upsertBedsForPatch,
  loadPatchData
} from '../storage';

interface UseAutoSaveProps {
  debounceMs?: number;
}

export const useAutoSave = ({ debounceMs = 3000 }: UseAutoSaveProps = {}) => {
  const { beds, isDirty, markClean, loadBeds } = useBedStore();
  const { currentPatchId } = usePatchStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debug logging for hook initialization
  useEffect(() => {
    console.log('🔧 useAutoSave (beds) hook initialized for patch:', currentPatchId);
  }, [currentPatchId]);

  // Save beds with patch ID
  const saveBeds = async () => {
    if (!isDirty || !currentPatchId) {
      console.log('⏭️ Skipping beds save - isDirty:', isDirty, 'currentPatchId:', currentPatchId);
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      console.log('💾 Saving beds to storage for patch:', currentPatchId, 'beds count:', beds.length);

      // Use optimized upsert operation for current patch
      await upsertBedsForPatch(currentPatchId, beds);

      markClean();
      console.log('✅ Beds saved successfully for patch:', currentPatchId);
    } catch (error) {
      console.error('❌ Failed to save beds:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  // Load beds for current patch
  const loadBedsFromStorage = async () => {
    if (!currentPatchId) {
      console.log('⏭️ No current patch, clearing beds');
      loadBeds([]);
      return;
    }

    try {
      console.log('📂 Loading beds from storage for patch:', currentPatchId);

      // Use optimized patch data loading
      const { beds: patchBeds } = await loadPatchData(currentPatchId);
      loadBeds(patchBeds as Bed[]);
      console.log('✅ Beds loaded successfully for patch:', currentPatchId, 'count:', patchBeds.length);
    } catch (error) {
      console.error('❌ Failed to load beds:', error);
      loadBeds([]);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!isDirty) {
      console.log('⏭️ Beds not dirty, skipping auto-save');
      return;
    }

    console.log('⏰ Scheduling beds auto-save in', debounceMs, 'ms for patch:', currentPatchId, 'beds count:', beds.length);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.log('🚀 Executing scheduled beds auto-save');
      saveBeds();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, beds, debounceMs, currentPatchId]);

  // Load beds when patch changes
  useEffect(() => {
    loadBedsFromStorage();
  }, [currentPatchId]);

  const manualSave = async (): Promise<void> => {
    console.log('🔧 Manual beds save triggered for patch:', currentPatchId);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return await saveBeds();
  };

  return {
    isSaving,
    saveError,
    manualSave
  };
};
