
import { useEffect, useRef, useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { usePatchStore } from '../stores/patchStore';

interface UseAutoSaveProps {
  debounceMs?: number;
}

const DB_NAME = 'AgroForestDB';
const DB_VERSION = 3;
const BEDS_STORE_NAME = 'beds';
const PLACEMENTS_STORE_NAME = 'placements';
const PATCHES_STORE_NAME = 'patches';

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
      console.log('💾 Saving beds to IndexedDB for patch:', currentPatchId, 'beds count:', beds.length);

      const db = await openDB();
      const transaction = db.transaction([BEDS_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(BEDS_STORE_NAME);
      
      // Get all existing beds to filter out old patch beds
      const getAllRequest = store.getAll();
      const allBeds = await new Promise<any[]>((resolve, reject) => {
        getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
        getAllRequest.onerror = () => reject(new Error('Failed to get existing beds'));
      });

      // Filter out beds from current patch
      const otherPatchBeds = allBeds.filter(bed => bed.patchId !== currentPatchId);
      
      // Clear and rebuild with all beds
      store.clear();
      
      // Add beds from other patches
      otherPatchBeds.forEach(bed => {
        store.add(bed);
      });
      
      // Add current patch beds with patch reference
      const bedsWithPatch = beds.map(bed => ({
        ...bed,
        patchId: currentPatchId
      }));
      
      bedsWithPatch.forEach(bed => {
        store.add(bed);
      });

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(new Error('Failed to save beds'));
        };
      });

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
      console.log('📂 Loading beds from IndexedDB for patch:', currentPatchId);
      const db = await openDB();
      if (!db.objectStoreNames.contains(BEDS_STORE_NAME)) {
        console.log('🆕 Beds store does not exist yet. It will be created.');
        loadBeds([]);
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
    } catch (error) {
      console.error('❌ Failed to load beds:', error);
      loadBeds([]);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!isDirty) return;

    console.log('⏰ Scheduling beds auto-save in', debounceMs, 'ms for patch:', currentPatchId);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
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
