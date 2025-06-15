
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { BedState, BedActions } from './types';
import { Bed, CanvasTool } from '../types/bed.types';
import { useHistoryStore } from './historyStore';

interface BedStateStore extends BedState, BedActions {
  removeBedsForPatch: (patchId: string) => void;
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
      const newBeds = [...get().beds, bed];
      set({ beds: newBeds, isDirty: true });
      useHistoryStore.getState().addToHistory(newBeds);
    },

    updateBed: (id, updates) => {
      const newBeds = get().beds.map(bed => 
        bed.id === id ? { ...bed, ...updates } : bed
      );
      set({ beds: newBeds, isDirty: true });
      useHistoryStore.getState().addToHistory(newBeds);
    },

    removeBeds: (ids) => {
      const newBeds = get().beds.filter(bed => !ids.includes(bed.id));
      const newSelectedIds = get().selectedBedIds.filter(id => !ids.includes(id));
      set({ 
        beds: newBeds, 
        selectedBedIds: newSelectedIds,
        isDirty: true
      });
      useHistoryStore.getState().addToHistory(newBeds);
    },

    removeBedsForPatch: (patchId) => {
        const { beds, selectedBedIds } = get();
        const bedsToKeep = beds.filter(b => b.patchId !== patchId);
        const bedsToKeepIds = new Set(bedsToKeep.map(b => b.id));
        set({
            beds: bedsToKeep,
            selectedBedIds: selectedBedIds.filter(id => bedsToKeepIds.has(id)),
            isDirty: true,
        });
        useHistoryStore.getState().addToHistory(bedsToKeep);
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
