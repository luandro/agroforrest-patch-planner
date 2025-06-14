
import { useEffect, useRef, useState } from 'react';
import { useBedStore } from '../stores/bedStore';

interface UseAutoSaveProps {
  debounceMs?: number;
}

export const useAutoSave = ({ debounceMs = 5000 }: UseAutoSaveProps = {}) => {
  const { beds, isDirty, markClean, loadBeds } = useBedStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Save to IndexedDB
  const saveBeds = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Save to IndexedDB
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('AgroForestDB', 1);
        
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('beds')) {
            db.createObjectStore('beds', { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['beds'], 'readwrite');
          const store = transaction.objectStore('beds');
          
          // Clear existing beds
          store.clear();
          
          // Add all current beds
          beds.forEach(bed => {
            store.add(bed);
          });

          transaction.oncomplete = () => {
            resolve();
          };

          transaction.onerror = () => {
            reject(new Error('Failed to save beds'));
          };
        };

        request.onerror = () => {
          reject(new Error('Failed to open database'));
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
      const loadedBeds = await new Promise<any[]>((resolve, reject) => {
        const request = indexedDB.open('AgroForestDB', 1);
        
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('beds')) {
            db.createObjectStore('beds', { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['beds'], 'readonly');
          const store = transaction.objectStore('beds');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result || []);
          };

          getAllRequest.onerror = () => {
            reject(new Error('Failed to load beds'));
          };
        };

        request.onerror = () => {
          reject(new Error('Failed to open database'));
        };
      });

      loadBeds(loadedBeds);
      console.log('Beds loaded successfully:', loadedBeds.length);
    } catch (error) {
      console.error('Failed to load beds:', error);
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
