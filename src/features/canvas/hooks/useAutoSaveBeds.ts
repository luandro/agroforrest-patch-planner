
import { useEffect, useRef, useState } from 'react';
import { useBedState } from '../stores/bedState';
import { Bed } from '../types/bed.types';

const DB_NAME = 'AgroForestDB';
const DB_VERSION = 2; // Ensure this matches other hooks
const STORE_NAME = 'beds';

interface UseAutoSaveBedsProps {
  debounceMs?: number;
}

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('patchId', 'patchId', { unique: false });
      } else {
        const store = request.transaction?.objectStore(STORE_NAME);
        if (store && !store.indexNames.contains('patchId')) {
          store.createIndex('patchId', 'patchId', { unique: false });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to open database for beds'));
  });
};

export const useAutoSaveBeds = ({ debounceMs = 2000 }: UseAutoSaveBedsProps = {}) => {
  const { beds, isDirty, markClean, loadBeds } = useBedState();
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const saveBeds = async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // This is inefficient but simple. For large datasets, a more granular approach would be needed.
      store.clear(); 
      
      beds.forEach(bed => {
        store.add(bed);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(new Error('Failed to save beds'));
      });

      markClean();
    } catch (error) {
      console.error('Failed to save beds:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadBedsFromStorage = async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();

      const loadedBeds = await new Promise<Bed[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
        getAllRequest.onerror = () => reject(new Error('Failed to load beds'));
      });
      
      loadBeds(loadedBeds);
    } catch (error) {
      console.error('Failed to load beds:', error);
      loadBeds([]);
    }
  };

  useEffect(() => {
    loadBedsFromStorage();
    // This effect should run only once on mount to load initial data.
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      saveBeds();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDirty, beds, debounceMs]);

  return { isSaving };
};
