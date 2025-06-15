import { useEffect, useRef, useState } from 'react';
import { usePlantPlacementStore, PlantPlacement } from '../stores/plantPlacementStore';

const DB_NAME = 'AgroForestDB';
const DB_VERSION = 2;
const STORE_NAME = 'placements';
const KEY_PATH = 'id';

interface UseAutoSavePlantsProps {
  debounceMs?: number;
}

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('beds')) {
        db.createObjectStore('beds', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: KEY_PATH });
        store.createIndex('patchId', 'patchId', { unique: false });
      } else {
        const store = request.transaction?.objectStore(STORE_NAME);
        if (store && !store.indexNames.contains('patchId')) {
          store.createIndex('patchId', 'patchId', { unique: false });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(new Error('Failed to open database'));
    };
  });
};

export const useAutoSavePlants = ({ debounceMs = 2000 }: UseAutoSavePlantsProps = {}) => {
  const { placements, isDirty, markClean, loadPlacements } = usePlantPlacementStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const savePlacements = async () => {
    if (!isDirty) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      store.clear();
      
      placements.forEach(placement => {
        store.add(placement);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
          resolve();
        };
        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(new Error('Failed to save placements'));
        };
      });

      markClean();
      console.log('Plant placements saved successfully');
    } catch (error) {
      console.error('Failed to save plant placements:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPlacementsFromStorage = async () => {
    try {
      const db = await openDB();
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log('Placements store does not exist yet. It will be created.');
        loadPlacements([]);
        return;
      }
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();

      const loadedPlacements = await new Promise<PlantPlacement[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
        getAllRequest.onerror = () => {
           console.error('Get all request error:', getAllRequest.error);
           reject(new Error('Failed to load placements'));
        }
      });
      
      loadPlacements(loadedPlacements);
      console.log('Plant placements loaded successfully:', loadedPlacements.length);
    } catch (error) {
      console.error('Failed to load plant placements:', error);
      loadPlacements([]);
    }
  };

  useEffect(() => {
    if (!isDirty) return;

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
  }, [isDirty, placements, debounceMs]);

  useEffect(() => {
    loadPlacementsFromStorage();
  }, []);

  const manualSave = () => {
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
