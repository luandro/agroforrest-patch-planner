
import { useEffect, useRef, useState } from 'react';
import { usePlantPlacementStore, PlantPlacement } from '../stores/plantPlacementStore';
import { usePatchStore } from '../stores/patchStore';
import { useBedStore } from '../stores/bedStore';

const DB_NAME = 'AgroForestDB';
const DB_VERSION = 3; // Updated to match patch version
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
        db.createObjectStore(STORE_NAME, { keyPath: KEY_PATH });
      }
      if (!db.objectStoreNames.contains('patches')) {
        const patchStore = db.createObjectStore('patches', { keyPath: 'id' });
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

export const useAutoSavePlants = ({ debounceMs = 5000 }: UseAutoSavePlantsProps = {}) => {
  const { placements, isDirty, markClean, loadPlacements } = usePlantPlacementStore();
  const { currentPatchId } = usePatchStore();
  const { beds } = useBedStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const savePlacements = async () => {
    if (!isDirty || !currentPatchId) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Get current bed IDs for this patch
      const currentPatchBedIds = beds.map(bed => bed.id);
      
      // Get all existing placements
      const getAllRequest = store.getAll();
      const allPlacements = await new Promise<PlantPlacement[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
        getAllRequest.onerror = () => reject(new Error('Failed to get existing placements'));
      });
      
      // Filter out old placements for current patch beds
      const otherPatchPlacements = allPlacements.filter(
        placement => !currentPatchBedIds.includes(placement.bedId)
      );
      
      // Clear store and add all placements
      store.clear();
      
      // Add placements from other patches
      otherPatchPlacements.forEach(placement => {
        store.add(placement);
      });
      
      // Add current patch placements
      placements.forEach(placement => {
        store.add(placement);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(new Error('Failed to save placements'));
        };
      });

      markClean();
      console.log('Plant placements saved successfully for patch:', currentPatchId);
    } catch (error) {
      console.error('Failed to save plant placements:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPlacementsFromStorage = async () => {
    if (!currentPatchId) return;
    
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

      const allPlacements = await new Promise<PlantPlacement[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
        getAllRequest.onerror = () => {
           console.error('Get all request error:', getAllRequest.error);
           reject(new Error('Failed to load placements'));
        }
      });
      
      // Get current patch bed IDs
      const currentPatchBedIds = beds.map(bed => bed.id);
      
      // Filter placements for current patch
      const patchPlacements = allPlacements.filter(
        placement => currentPatchBedIds.includes(placement.bedId)
      );
      
      loadPlacements(patchPlacements);
      console.log('Plant placements loaded successfully for patch:', currentPatchId, patchPlacements.length);
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
