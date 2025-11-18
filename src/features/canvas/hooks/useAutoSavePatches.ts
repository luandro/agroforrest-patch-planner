
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePatchStore } from '../stores/patchStore';
import { Patch } from '../types/patch.types';
import {
  openDB,
  loadFromLocalStorageFallback,
  upsertPatches,
  PATCHES_STORE_NAME
} from '../storage';

interface UseAutoSavePatchesProps {
  debounceMs?: number;
}

export const useAutoSavePatches = ({ debounceMs = 2000 }: UseAutoSavePatchesProps = {}) => {
  const { patches, isDirty, markClean, loadPatches, setCurrentPatch, createPatch } = usePatchStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitialized = useRef(false);

  // Debug logging for hook initialization (mount only)
  useEffect(() => {
    console.log('🔧 useAutoSavePatches hook initialized');
  }, []);

  const savePatches = useCallback(async () => {
    if (!isDirty) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      console.log('💾 Saving patches to storage...', patches.length);

      // Use optimized upsert operation
      await upsertPatches(patches);

      markClean();
      console.log('✅ Patches saved successfully:', patches.length);
    } catch (error) {
      console.error('❌ Failed to save patches:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, patches, markClean]);

  const loadPatchesFromStorage = useCallback(async () => {
    try {
      console.log('📂 Loading patches from storage...');

      let loadedPatches: Patch[] = [];

      // Try IndexedDB first, fallback to localStorage
      try {
        const db = await openDB();

        if (!db.objectStoreNames.contains(PATCHES_STORE_NAME)) {
          console.log('🆕 Patches store does not exist yet. Trying localStorage fallback.');
          loadedPatches = loadFromLocalStorageFallback('patches', []);
          db.close();
        } else {
          const transaction = db.transaction([PATCHES_STORE_NAME], 'readonly');
          const store = transaction.objectStore(PATCHES_STORE_NAME);
          const getAllRequest = store.getAll();

          loadedPatches = await new Promise<Patch[]>((resolve, reject) => {
            getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
            getAllRequest.onerror = () => {
              console.error('Get all request error:', getAllRequest.error);
              reject(new Error('Failed to load patches'));
            };
          });

          db.close();
        }
      } catch (indexedDBError) {
        console.warn('⚠️ IndexedDB failed, using localStorage fallback:', indexedDBError);
        loadedPatches = loadFromLocalStorageFallback('patches', []);
      }

      if (loadedPatches.length === 0) {
        console.log('🆕 No patches found. Creating default patch.');
        // Create default patch inline to avoid circular dependency
        try {
          const defaultPatchId = await createPatch({
            name: 'Meu Primeiro Canteiro',
            description: 'Canteiro principal para experimentos agroflorestais',
            size: { width: 20, height: 20 }
          });
          console.log('✅ Default patch created:', defaultPatchId);

          // Immediately save the new default patch to prevent data loss on quick page close
          setTimeout(async () => {
            const currentPatches = usePatchStore.getState().patches;
            if (currentPatches.length > 0) {
              await upsertPatches(currentPatches);
              usePatchStore.getState().markClean();
              console.log('💾 Default patch saved immediately');
            }
          }, 100);
        } catch (error) {
          console.error('❌ Failed to create default patch:', error);
          setSaveError('Failed to create default patch');
        }
      } else {
        // Load patches without marking dirty
        loadPatches(loadedPatches, false);

        // Restore last active patch
        const savedCurrentPatchId = loadFromLocalStorageFallback<string | null>('currentPatchId', null);
        if (savedCurrentPatchId && loadedPatches.find(p => p.id === savedCurrentPatchId)) {
          setCurrentPatch(savedCurrentPatchId);
          console.log('✅ Restored current patch:', savedCurrentPatchId);
        } else {
          setCurrentPatch(loadedPatches[0].id);
          console.log('✅ Set first patch as current:', loadedPatches[0].id);
        }
      }

      console.log('✅ Patches loaded successfully:', loadedPatches.length);
    } catch (error) {
      console.error('❌ Failed to load patches:', error);
      // Create default patch on error
      try {
        const defaultPatchId = await createPatch({
          name: 'Meu Primeiro Canteiro',
          description: 'Canteiro principal para experimentos agroflorestais',
          size: { width: 20, height: 20 }
        });
        console.log('✅ Default patch created after error:', defaultPatchId);

        // Immediately save the new default patch to prevent data loss on quick page close
        setTimeout(async () => {
          const currentPatches = usePatchStore.getState().patches;
          if (currentPatches.length > 0) {
            await upsertPatches(currentPatches);
            usePatchStore.getState().markClean();
            console.log('💾 Default patch saved immediately');
          }
        }, 100);
      } catch (createError) {
        console.error('❌ Failed to create default patch:', createError);
        setSaveError('Failed to create default patch');
      }
    }
  }, [createPatch, loadPatches, setCurrentPatch]);

  // Auto-save effect with immediate save for new patches
  useEffect(() => {
    if (!isDirty) return;

    console.log('⏰ Scheduling patch auto-save in', debounceMs, 'ms');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Immediate save for first-time patch creation
    if (patches.length === 1 && !isInitialized.current) {
      console.log('🚀 Immediate save for new default patch');
      savePatches();
      isInitialized.current = true;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      savePatches();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, patches, debounceMs, savePatches]);

  // Load patches on mount
  useEffect(() => {
    if (!isInitialized.current) {
      loadPatchesFromStorage();
      isInitialized.current = true;
    }
  }, [loadPatchesFromStorage]);

  const manualSave = useCallback(async (): Promise<void> => {
    console.log('🔧 Manual patch save triggered');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return await savePatches();
  }, [savePatches]);

  return {
    isSaving,
    saveError,
    manualSave
  };
};
