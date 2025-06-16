
/**
 * Debug panel for testing storage functionality
 * This component can be temporarily added to test bed persistence
 */

import React from 'react';
import { useBedStore } from '../stores/bedStore';
import { usePatchStore } from '../stores/patchStore';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { Bed } from '../types/bed.types';

export const StorageDebugPanel: React.FC = () => {
  const { beds, addBed, isDirty } = useBedStore();
  const { currentPatchId } = usePatchStore();
  const storage = useOfflineStorage();

  const createTestBed = () => {
    const testBed: Bed = {
      id: `test-bed-${Date.now()}`,
      shape: 'rectangle',
      position: { x: 0, y: 0 },
      dimensions: { length: 5, width: 3 },
      rotation: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    console.log('🧪 Creating test bed:', testBed);
    addBed(testBed);
  };

  const manualSave = () => {
    console.log('🧪 Manual save triggered');
    storage.saveAll();
  };

  const exportData = async () => {
    try {
      const data = await storage.exportData();
      console.log('🧪 Exported data:', data);
      
      // Create download link
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agroforest-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('🧪 Export failed:', error);
    }
  };

  const clearData = async () => {
    if (confirm('Are you sure you want to clear all data?')) {
      try {
        await storage.clearData();
        console.log('🧪 Data cleared');
      } catch (error) {
        console.error('🧪 Clear failed:', error);
      }
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-3">Storage Debug Panel</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Storage Status:</strong>
          <div className="ml-2">
            <div>Initialized: {storage.isInitialized ? '✅' : '❌'}</div>
            <div>Loading: {storage.isLoading ? '⏳' : '✅'}</div>
            <div>Saving: {storage.isSaving ? '💾' : '✅'}</div>
            <div>Dirty: {storage.isDirty ? '🔴' : '🟢'}</div>
            <div>Beds Dirty: {storage.bedsDirty ? '🔴' : '🟢'}</div>
          </div>
        </div>
        
        <div>
          <strong>Current State:</strong>
          <div className="ml-2">
            <div>Patch: {currentPatchId?.slice(-8) || 'None'}</div>
            <div>Beds: {beds.length}</div>
            <div>Store Dirty: {isDirty ? '🔴' : '🟢'}</div>
          </div>
        </div>

        {storage.saveErrors.length > 0 && (
          <div>
            <strong>Errors:</strong>
            <div className="ml-2 text-red-600">
              {storage.saveErrors.map((error, i) => (
                <div key={i}>{error}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={createTestBed}
          className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Create Test Bed
        </button>
        
        <button
          onClick={manualSave}
          className="w-full bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
          disabled={!storage.isDirty}
        >
          Manual Save
        </button>
        
        <button
          onClick={exportData}
          className="w-full bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
        >
          Export Data
        </button>
        
        <button
          onClick={clearData}
          className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
        >
          Clear All Data
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <div>Last Save: {storage.lastSaveTime ? new Date(storage.lastSaveTime).toLocaleTimeString() : 'Never'}</div>
      </div>
    </div>
  );
};
