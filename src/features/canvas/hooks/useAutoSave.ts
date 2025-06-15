
import { useEffect, useRef, useState } from 'react';
import { useBedStore } from '../stores/bedStore';

interface UseAutoSaveProps {
  debounceMs?: number;
}

const DB_NAME = 'AgroForestDB';
const DB_VERSION = 2; // IMPORTANT: Must match useAutoSavePlants
const BEDS_STORE_NAME = 'beds';
const PLACEMENTS_STORE_NAME = 'placements';

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BEDS_STORE_NAME)) {
        db.createObjectStore(BEDS_STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PLACEMENTS_STORE_NAME)) {
        db.createObjectStore(PLACEMENTS_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(new Error('Failed to open database'));
    };
  });
};


export const useAutoSave = ({ debounceMs = 5000 }: UseAutoSaveProps = {}) => {
  const { beds, isDirty, markClean, loadBeds } = useBedStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Save to IndexedDB
  const saveBeds = async () => {
    if (!isDirty) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);

      const db = await openDB();
      const transaction = db.transaction([BEDS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(BEDS_STORE_NAME);
      
      store.clear();
      
      beds.forEach(bed => {
        store.add(bed);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(new Error('Failed to save beds'));
        };
      });

      markClean();
      console.log('Beds saved successfully');
    } catch (error) {
      console.error('Failed to save beds:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  // Load beds from IndexedDB
  const loadBedsFromStorage = async () => {
    try {
      const db = await openDB();
      if (!db.objectStoreNames.contains(BEDS_STORE_NAME)) {
        console.log('Beds store does not exist yet. It will be created.');
        loadBeds([]);
        return;
      }
      const transaction = db.transaction([BEDS_STORE_NAME], 'readonly');
      const store = transaction.objectStore(BEDS_STORE_NAME);
      const getAllRequest = store.getAll();

      const loadedBeds = await new Promise<any[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result || []);
        };

        getAllRequest.onerror = () => {
          console.error('Get all request error:', getAllRequest.error);
          reject(new Error('Failed to load beds'));
        };
      });

      loadBeds(loadedBeds);
      console.log('Beds loaded successfully:', loadedBeds.length);
    } catch (error) {
      console.error('Failed to load beds:', error);
      loadBeds([]);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!isDirty) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveBeds();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, beds, debounceMs]);

  // Load beds on mount
  useEffect(() => {
    loadBedsFromStorage();
  }, []);

  // Manual save function
  const manualSave = () => {
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
