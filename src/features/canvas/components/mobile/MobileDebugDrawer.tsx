
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from '@/components/ui/drawer';
import { Bug, X } from 'lucide-react';
import { useBedStore } from '../../stores/bedStore';
import { usePatchStore } from '../../stores/patchStore';
import { useOfflineStorage } from '../../hooks/useOfflineStorage';
import { Bed } from '../../types/bed.types';

export const MobileDebugDrawer: React.FC = () => {
  const { beds, addBed, isDirty } = useBedStore();
  const { currentPatchId } = usePatchStore();
  const storage = useOfflineStorage();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

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
    setIsOpen(false);
  };

  const manualSave = () => {
    console.log('🧪 Manual save triggered');
    storage.saveAll();
  };

  const exportData = async () => {
    try {
      const data = await storage.exportData();
      console.log('🧪 Exported data:', data);
      
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
        setIsOpen(false);
      } catch (error) {
        console.error('🧪 Clear failed:', error);
      }
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-20 right-4 z-40 w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-lg"
          title="Debug Panel"
        >
          <Bug className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle className="text-lg font-semibold">Debug Panel</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Storage Status */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Storage Status</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Initialized: {storage.isInitialized ? '✅' : '❌'}</div>
              <div>Loading: {storage.isLoading ? '⏳' : '✅'}</div>
              <div>Saving: {storage.isSaving ? '💾' : '✅'}</div>
              <div>Dirty: {storage.isDirty ? '🔴' : '🟢'}</div>
              <div>Beds Dirty: {storage.bedsDirty ? '🔴' : '🟢'}</div>
              <div>Store Dirty: {isDirty ? '🔴' : '🟢'}</div>
            </div>
          </div>
          
          {/* Current State */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Current State</h3>
            <div className="space-y-1 text-xs">
              <div>Patch: {currentPatchId?.slice(-8) || 'None'}</div>
              <div>Beds: {beds.length}</div>
            </div>
          </div>

          {/* Errors */}
          {storage.saveErrors.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-red-600">Errors</h3>
              <div className="space-y-1 text-xs text-red-600">
                {storage.saveErrors.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={createTestBed}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              size="sm"
            >
              Create Test Bed
            </Button>
            
            <Button
              onClick={manualSave}
              className="w-full bg-green-500 text-white hover:bg-green-600"
              size="sm"
              disabled={!storage.isDirty}
            >
              Manual Save
            </Button>
            
            <Button
              onClick={exportData}
              className="w-full bg-purple-500 text-white hover:bg-purple-600"
              size="sm"
            >
              Export Data
            </Button>
            
            <Button
              onClick={clearData}
              variant="destructive"
              className="w-full"
              size="sm"
            >
              Clear All Data
            </Button>
          </div>

          {/* Metadata */}
          <div className="pt-2 border-t text-xs text-gray-500">
            <div>Last Save: {storage.lastSaveTime ? new Date(storage.lastSaveTime).toLocaleTimeString() : 'Never'}</div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
