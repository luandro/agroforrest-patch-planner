
import { useEffect, useRef, useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { usePatchStore } from '../stores/patchStore';
import {
  openDB,
  saveToLocalStorageFallback,
  loadFromLocalStorageFallback,
  BEDS_STORE_NAME
} from '../utils/storageManager';

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

      // Try IndexedDB first, fallback to localStorage
      try {
        const db = await openDB();
        const transaction = db.transaction([BEDS_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(BEDS_STORE_NAME);

        // Get existing beds for current patch to identify which ones to remove
        const getAllRequest = store.getAll();
        const allBeds = await new Promise<any[]>((resolve, reject) => {
          getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
          getAllRequest.onerror = () => reject(new Error('Failed to get existing beds'));
        });

        // Find beds from current patch that are no longer present
        const existingPatchBeds = allBeds.filter(bed => bed.patchId === currentPatchId);
        const currentBedIds = new Set(beds.map(bed => bed.id));
        const bedsToDelete = existingPatchBeds.filter(bed => !currentBedIds.has(bed.id));

        // Remove obsolete beds from current patch
        const deletePromises = bedsToDelete.map(bed => 
          new Promise<void>((resolve, reject) => {
            const deleteRequest = store.delete(bed.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          })
        );

        // Add/update current patch beds using upsert (put)
        const bedsWithPatch = beds.map(bed => ({
          ...bed,
          patchId: currentPatchId
        }));

        const upsertPromises = bedsWithPatch.map(bed =>
          new Promise<void>((resolve, reject) => {
            const putRequest = store.put(bed);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          })
        );

        // Wait for all operations to complete
        await Promise.all([...deletePromises, ...upsertPromises]);

        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => {
            console.error('Transaction error:', transaction.error);
            reject(new Error('Failed to save beds'));
          };
        });

        db.close();
      } catch (indexedDBError) {
        console.warn('⚠️ IndexedDB failed, using localStorage fallback:', indexedDBError);

        // Load existing beds from localStorage
        const existingBeds = loadFromLocalStorageFallback('beds', []);
        const otherPatchBeds = existingBeds.filter((bed: any) => bed.patchId !== currentPatchId);

        // Add current patch beds
        const bedsWithPatch = beds.map(bed => ({
          ...bed,
          patchId: currentPatchId
        }));

        const allBeds = [...otherPatchBeds, ...bedsWithPatch];
        saveToLocalStorageFallback('beds', allBeds);
      }

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

      // Try IndexedDB first, fallback to localStorage
      try {
        const db = await openDB();
        if (!db.objectStoreNames.contains(BEDS_STORE_NAME)) {
          console.log('🆕 Beds store does not exist yet. It will be created.');
          loadBeds([]);
          db.close();
          return;
        }

        const transaction = db.transaction([BEDS_STORE_NAME], 'readonly');
        const store = transaction.objectStore(BEDS_STORE_NAME);
        const getAllRequest = store.getAll();

        const allBeds = await new Promise<any[]>((resolve, reject) => {
          getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
          getAllRequest.onerror = () => {
            console.error('Get all request error:', getAllRequest.error);
            reject(new Error('Failed to load beds'));
          };
        });

        // Filter beds for current patch
        const patchBeds = allBeds.filter(bed => bed.patchId === currentPatchId);
        loadBeds(patchBeds);
        console.log('✅ Beds loaded successfully for patch:', currentPatchId, 'count:', patchBeds.length);

        db.close();
      } catch (indexedDBError) {
        console.warn('⚠️ IndexedDB failed, using localStorage fallback:', indexedDBError);

        // Load from localStorage fallback
        const allBeds = loadFromLocalStorageFallback('beds', []);
        const patchBeds = allBeds.filter((bed: any) => bed.patchId === currentPatchId);
        loadBeds(patchBeds);
        console.log('✅ Beds loaded from localStorage for patch:', currentPatchId, 'count:', patchBeds.length);
      }
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

  const manualSave = () => {
    console.log('🔧 Manual beds save triggered for patch:', currentPatchId);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveBeds();
  };

  return {
    isSaving,
    saveError,
    manualSave
  };
};
