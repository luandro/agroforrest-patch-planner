
import { useEffect, useRef, useState } from 'react';
import { usePatchStore } from '../stores/patchStore';
import { Patch } from '../types/patch.types';
import {
  openDB,
  saveToLocalStorageFallback,
  loadFromLocalStorageFallback,
  PATCHES_STORE_NAME
} from '../utils/storageManager';

interface UseAutoSavePatchesProps {
  debounceMs?: number;
}

export const useAutoSavePatches = ({ debounceMs = 2000 }: UseAutoSavePatchesProps = {}) => {
  const { patches, isDirty, markClean, loadPatches, setCurrentPatch, createPatch } = usePatchStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitialized = useRef(false);

  // Debug logging for hook initialization
  useEffect(() => {
    console.log('🔧 useAutoSavePatches hook initialized');
    console.log('📦 Initial state:', { patchesCount: patches.length, isDirty });
  }, []);

  const savePatches = async () => {
    if (!isDirty) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      console.log('💾 Saving patches to storage...', patches.length);

      // Try IndexedDB first, fallback to localStorage
      try {
        const db = await openDB();
        const transaction = db.transaction([PATCHES_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(PATCHES_STORE_NAME);

        // Get existing patches to identify which ones to remove
        const getAllRequest = store.getAll();
        const existingPatches = await new Promise<Patch[]>((resolve, reject) => {
          getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
          getAllRequest.onerror = () => reject(new Error('Failed to get existing patches'));
        });

        // Find patches that are no longer present
        const currentPatchIds = new Set(patches.map(patch => patch.id));
        const patchesToDelete = existingPatches.filter(patch => !currentPatchIds.has(patch.id));

        // Remove obsolete patches
        const deletePromises = patchesToDelete.map(patch => 
          new Promise<void>((resolve, reject) => {
            const deleteRequest = store.delete(patch.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          })
        );

        // Add/update current patches using upsert (put)
        const upsertPromises = patches.map(patch =>
          new Promise<void>((resolve, reject) => {
            const putRequest = store.put(patch);
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
            reject(new Error('Failed to save patches'));
          };
        });

        db.close();
      } catch (indexedDBError) {
        console.warn('⚠️ IndexedDB failed, using localStorage fallback:', indexedDBError);
        saveToLocalStorageFallback('patches', patches);
      }

      markClean();
      console.log('✅ Patches saved successfully:', patches.length);
    } catch (error) {
      console.error('❌ Failed to save patches:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPatchesFromStorage = async () => {
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
        await createDefaultPatch();
      } else {
        // Load patches without marking dirty
        loadPatches(loadedPatches, false);

        // Restore last active patch
        const savedCurrentPatchId = localStorage.getItem('agroforest_current_patch_id');
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
      await createDefaultPatch();
    }
  };

  const createDefaultPatch = async () => {
    try {
      const defaultPatchId = await createPatch({
        name: 'Meu Primeiro Canteiro',
        description: 'Canteiro principal para experimentos agroflorestais',
        size: { width: 20, height: 20 }
      });
      
      console.log('✅ Default patch created:', defaultPatchId);
      
      // Immediately save the new default patch
      setTimeout(() => {
        savePatches();
      }, 100);
    } catch (error) {
      console.error('❌ Failed to create default patch:', error);
      setSaveError('Failed to create default patch');
    }
  };

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
  }, [isDirty, patches, debounceMs]);

  // Load patches on mount
  useEffect(() => {
    if (!isInitialized.current) {
      loadPatchesFromStorage();
      isInitialized.current = true;
    }
  }, []);

  const manualSave = () => {
    console.log('🔧 Manual patch save triggered');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    savePatches();
  };

  return {
    isSaving,
    saveError,
    manualSave
  };
};
