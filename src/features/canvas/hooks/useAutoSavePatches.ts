
import { useEffect, useRef, useState } from 'react';
import { usePatchStore } from '../stores/patchStore';
import { Patch } from '../types/patch.types';

const DB_NAME = 'AgroForestDB';
const DB_VERSION = 3; // Increment version for new patches store
const PATCHES_STORE_NAME = 'patches';

interface UseAutoSavePatchesProps {
  debounceMs?: number;
}

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      
      // Create existing stores if they don't exist
      if (!db.objectStoreNames.contains('beds')) {
        db.createObjectStore('beds', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('placements')) {
        db.createObjectStore('placements', { keyPath: 'id' });
      }
      
      // Create patches store
      if (!db.objectStoreNames.contains(PATCHES_STORE_NAME)) {
        const patchStore = db.createObjectStore(PATCHES_STORE_NAME, { keyPath: 'id' });
        patchStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(new Error('Failed to open database'));
    };
  });
};

export const useAutoSavePatches = ({ debounceMs = 5000 }: UseAutoSavePatchesProps = {}) => {
  const { patches, isDirty, markClean, loadPatches, setCurrentPatch } = usePatchStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const savePatches = async () => {
    if (!isDirty) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      
      const db = await openDB();
      const transaction = db.transaction([PATCHES_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(PATCHES_STORE_NAME);
      
      // Clear and save all patches
      store.clear();
      patches.forEach(patch => {
        store.add(patch);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(new Error('Failed to save patches'));
        };
      });

      markClean();
      console.log('Patches saved successfully:', patches.length);
    } catch (error) {
      console.error('Failed to save patches:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPatchesFromStorage = async () => {
    try {
      const db = await openDB();
      
      if (!db.objectStoreNames.contains(PATCHES_STORE_NAME)) {
        console.log('Patches store does not exist yet. Creating default patch.');
        
        // Create a default patch
        const defaultPatch: Patch = {
          id: `patch-${Date.now()}`,
          name: 'Meu Primeiro Canteiro',
          description: 'Canteiro principal para experimentos agroflorestais',
          size: { width: 20, height: 20 },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastViewport: { zoom: 1, centerX: 0, centerY: 0 }
        };
        
        loadPatches([defaultPatch]);
        setCurrentPatch(defaultPatch.id);
        return;
      }

      const transaction = db.transaction([PATCHES_STORE_NAME], 'readonly');
      const store = transaction.objectStore(PATCHES_STORE_NAME);
      const getAllRequest = store.getAll();

      const loadedPatches = await new Promise<Patch[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
        getAllRequest.onerror = () => {
          console.error('Get all request error:', getAllRequest.error);
          reject(new Error('Failed to load patches'));
        };
      });

      if (loadedPatches.length === 0) {
        // Create default patch if none exist
        const defaultPatch: Patch = {
          id: `patch-${Date.now()}`,
          name: 'Meu Primeiro Canteiro',
          description: 'Canteiro principal para experimentos agroflorestais',
          size: { width: 20, height: 20 },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastViewport: { zoom: 1, centerX: 0, centerY: 0 }
        };
        
        loadPatches([defaultPatch]);
        setCurrentPatch(defaultPatch.id);
      } else {
        loadPatches(loadedPatches);
        
        // Restore last active patch
        const savedCurrentPatchId = localStorage.getItem('currentPatchId');
        if (savedCurrentPatchId && loadedPatches.find(p => p.id === savedCurrentPatchId)) {
          setCurrentPatch(savedCurrentPatchId);
        } else {
          setCurrentPatch(loadedPatches[0].id);
        }
      }
      
      console.log('Patches loaded successfully:', loadedPatches.length);
    } catch (error) {
      console.error('Failed to load patches:', error);
      
      // Create default patch on error
      const defaultPatch: Patch = {
        id: `patch-${Date.now()}`,
        name: 'Meu Primeiro Canteiro',
        description: 'Erro ao carregar - canteiro de recuperação',
        size: { width: 20, height: 20 },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastViewport: { zoom: 1, centerX: 0, centerY: 0 }
      };
      
      loadPatches([defaultPatch]);
      setCurrentPatch(defaultPatch.id);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!isDirty) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
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
    loadPatchesFromStorage();
  }, []);

  const manualSave = () => {
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
