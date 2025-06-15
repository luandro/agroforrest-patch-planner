
import { useEffect, useRef, useState } from 'react';
import { usePatchStore } from '../stores/patchStore';
import { Patch } from '../types/patch.types';

const DB_NAME = 'AgroForestDB';
const DB_VERSION = 2; // Version incremented to handle schema changes
const PATCH_STORE_NAME = 'patches';
const META_STORE_NAME = 'app_meta';
const ACTIVE_PATCH_KEY = 'activePatchId';

interface UseAutoSavePatchesProps {
  debounceMs?: number;
}

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains('beds')) {
        db.createObjectStore('beds', { keyPath: 'id' });
      }
       if (!db.objectStoreNames.contains('placements')) {
        db.createObjectStore('placements', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PATCH_STORE_NAME)) {
        db.createObjectStore(PATCH_STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(META_STORE_NAME)) {
        db.createObjectStore(META_STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error(`Database error: ${request.error}`));
  });
};

export const useAutoSavePatches = ({ debounceMs = 1000 }: UseAutoSavePatchesProps = {}) => {
  const { patches, activePatchId, isDirty, markClean, setPatches, setActivePatchId, setLoaded } = usePatchStore();
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const saveState = async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      const db = await openDB();
      const transaction = db.transaction([PATCH_STORE_NAME, META_STORE_NAME], 'readwrite');
      const patchStore = transaction.objectStore(PATCH_STORE_NAME);
      const metaStore = transaction.objectStore(META_STORE_NAME);

      patchStore.clear();
      patches.forEach(patch => patchStore.put(patch));

      if (activePatchId) {
        metaStore.put({ key: ACTIVE_PATCH_KEY, value: activePatchId });
      } else {
        metaStore.delete(ACTIVE_PATCH_KEY);
      }
      
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      markClean();
    } catch (error) {
      console.error('Failed to save patch state:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadState = async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction([PATCH_STORE_NAME, META_STORE_NAME], 'readonly');
      const patchStore = transaction.objectStore(PATCH_STORE_NAME);
      const metaStore = transaction.objectStore(META_STORE_NAME);

      const patchesReq = patchStore.getAll();
      const activeIdReq = metaStore.get(ACTIVE_PATCH_KEY);

      const loadedPatches = await new Promise<Patch[]>((resolve, reject) => {
        patchesReq.onsuccess = () => resolve(patchesReq.result || []);
        patchesReq.onerror = () => reject(patchesReq.error);
      });
      
      const activeIdResult = await new Promise<{value: string} | undefined>((resolve, reject) => {
        activeIdReq.onsuccess = () => resolve(activeIdReq.result);
        activeIdReq.onerror = () => reject(activeIdReq.error);
      });

      setPatches(loadedPatches);
      setActivePatchId(activeIdResult?.value ?? null);
      
    } catch (error) {
      console.error('Failed to load patch state:', error);
      setLoaded();
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      saveState();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [patches, activePatchId, isDirty, debounceMs]);

  return { isSaving };
};
