
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { BedState, BedActions } from './types';
import { Bed, CanvasTool } from '../types/bed.types';
import { usePatchStore } from './patchStore';

interface BedStateStore extends BedState, BedActions {
  // Internal method for other stores to update beds
  _setBeds: (beds: Bed[]) => void;
  _setDirty: (dirty: boolean) => void;
}

export const useBedState = create<BedStateStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    beds: [],
    selectedBedIds: [],
    tool: 'pan' as CanvasTool,
    isDirty: false,

    // Actions
    addBed: (bed) => {
      const state = get();
      const { currentPatchId } = usePatchStore.getState();
      
      const bedWithPatch: Bed = {
        ...bed,
        patchId: currentPatchId || undefined
      };
      
      const newBeds = [...state.beds, bedWithPatch];
      set({ beds: newBeds, isDirty: true });
      console.log('🛏️ Bed added and marked dirty:', bed.id);
    },

    updateBed: (id, updates) => {
      const state = get();
      const newBeds = state.beds.map(bed => 
        bed.id === id ? { ...bed, ...updates } : bed
      );
      set({ beds: newBeds, isDirty: true });
      console.log('📝 Bed updated and marked dirty:', id);
    },

    removeBeds: (ids) => {
      const state = get();
      const newBeds = state.beds.filter(bed => !ids.includes(bed.id));
      const newSelectedIds = state.selectedBedIds.filter(id => !ids.includes(id));
      set({ 
        beds: newBeds, 
        selectedBedIds: newSelectedIds,
        isDirty: true
      });
      console.log('🗑️ Beds removed and marked dirty:', ids);
    },

    selectBeds: (ids) => set({ selectedBedIds: ids }),
    
    clearSelection: () => set({ selectedBedIds: [] }),
    
    toggleBedSelection: (id) => {
      const state = get();
      const isSelected = state.selectedBedIds.includes(id);
      const newSelectedIds = isSelected 
        ? state.selectedBedIds.filter(bedId => bedId !== id)
        : [...state.selectedBedIds, id];
      set({ selectedBedIds: newSelectedIds });
    },

    setTool: (tool) => set({ tool }),
    
    loadBeds: (beds) => {
      set({ beds, isDirty: false });
      console.log('📂 Beds loaded, count:', beds.length);
    },
    
    markClean: () => {
      set({ isDirty: false });
      console.log('✅ Bed store marked clean');
    },

    // Internal methods
    _setBeds: (beds) => set({ beds }),
    _setDirty: (dirty) => set({ isDirty: dirty })
  }))
);
