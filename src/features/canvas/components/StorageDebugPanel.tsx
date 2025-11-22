
/**
 * Debug panel for testing storage functionality
 * This component can be temporarily added to test bed persistence
 */

import React, { useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { usePatchStore } from '../stores/patchStore';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { Bed } from '../types/bed.types';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const StorageDebugPanel: React.FC = () => {
  const { beds, addBed, isDirty } = useBedStore();
  const { currentPatchId } = usePatchStore();
  const storage = useOfflineStorage();

  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bg-white border border-gray-300 rounded-lg shadow-lg z-[999]",
        "bottom-20 right-4 md:bottom-4 md:right-4",
        isMinimized ? "w-48" : "w-80 max-w-[calc(100vw-2rem)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-bold text-sm flex items-center gap-2">
          🧪 Debug Panel
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content - Only show when not minimized */}
      {!isMinimized && (
        <>
          <div className="p-3 space-y-2 text-xs max-h-[60vh] overflow-y-auto">
            <div>
              <strong>Storage Status:</strong>
              <div className="ml-2 mt-1">
                <div>Initialized: {storage.isInitialized ? '✅' : '❌'}</div>
                <div>Loading: {storage.isLoading ? '⏳' : '✅'}</div>
                <div>Saving: {storage.isSaving ? '💾' : '✅'}</div>
                <div>Dirty: {storage.isDirty ? '🔴' : '🟢'}</div>
                <div>Beds Dirty: {storage.bedsDirty ? '🔴' : '🟢'}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <strong>Current State:</strong>
              <div className="ml-2 mt-1">
                <div>Patch: {currentPatchId?.slice(-8) || 'None'}</div>
                <div>Beds: {beds.length}</div>
                <div>Store Dirty: {isDirty ? '🔴' : '🟢'}</div>
              </div>
            </div>

            {storage.saveErrors.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <strong>Errors:</strong>
                <div className="ml-2 mt-1 text-red-600">
                  {storage.saveErrors.map((error, i) => (
                    <div key={i}>{error}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 space-y-2 border-t border-gray-200">
            <button
              onClick={createTestBed}
              className="w-full bg-blue-500 text-white px-2 py-1.5 rounded text-xs hover:bg-blue-600 transition-colors"
            >
              Create Test Bed
            </button>

            <button
              onClick={manualSave}
              className="w-full bg-green-500 text-white px-2 py-1.5 rounded text-xs hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!storage.isDirty}
            >
              Manual Save
            </button>

            <button
              onClick={exportData}
              className="w-full bg-purple-500 text-white px-2 py-1.5 rounded text-xs hover:bg-purple-600 transition-colors"
            >
              Export Data
            </button>

            <button
              onClick={clearData}
              className="w-full bg-red-500 text-white px-2 py-1.5 rounded text-xs hover:bg-red-600 transition-colors"
            >
              Clear All Data
            </button>
          </div>

          <div className="px-3 pb-3 text-xs text-gray-500">
            <div>Last Save: {storage.lastSaveTime ? new Date(storage.lastSaveTime).toLocaleTimeString() : 'Never'}</div>
          </div>
        </>
      )}

      {/* Minimized state indicator */}
      {isMinimized && (
        <div className="p-3 text-xs text-center text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <span>{storage.isSaving ? '💾' : storage.isDirty ? '🔴' : '🟢'}</span>
            <span>{beds.length} beds</span>
          </div>
        </div>
      )}
    </div>
  );
};
