
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { BedState, BedActions } from './types';
import { Bed, CanvasTool } from '../types/bed.types';

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
      const newBeds = [...state.beds, bed];
      set({ beds: newBeds, isDirty: true });
    },

    updateBed: (id, updates) => {
      const state = get();
      const newBeds = state.beds.map(bed => 
        bed.id === id ? { ...bed, ...updates } : bed
      );
      set({ beds: newBeds, isDirty: true });
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
    
    loadBeds: (beds) => set({ beds, isDirty: false }),
    
    markClean: () => set({ isDirty: false }),

    // Internal methods
    _setBeds: (beds) => set({ beds }),
    _setDirty: (dirty) => set({ isDirty: dirty })
  }))
);
