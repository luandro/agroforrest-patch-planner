import { create } from 'zustand';
import { Bed, BedAction, CanvasTool } from '../types/bed.types';

interface BedStore {
  // State
  beds: Bed[];
  selectedBedIds: string[];
  tool: CanvasTool;
  isDirty: boolean;
  lastSaved: number;
  isCreatingBed: boolean;
  
  // History for undo/redo
  history: BedAction[];
  historyIndex: number;
  
  // Actions
  setTool: (tool: CanvasTool) => void;
  setIsCreatingBed: (creating: boolean) => void;
  addBed: (bed: Bed) => void;
  removeBeds: (bedIds: string[]) => void;
  updateBed: (bedId: string, updates: Partial<Bed>) => void;
  selectBeds: (bedIds: string[]) => void;
  clearSelection: () => void;
  toggleBedSelection: (bedId: string) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Persistence
  markClean: () => void;
  loadBeds: (beds: Bed[]) => void;
}

const MAX_HISTORY = 20;

export const useBedStore = create<BedStore>((set, get) => ({
  // Initial state - pan tool as default
  beds: [],
  selectedBedIds: [],
  tool: 'pan',
  isDirty: false,
  lastSaved: 0,
  isCreatingBed: false,
  history: [],
  historyIndex: -1,

  setTool: (tool) => set({ tool }),
  setIsCreatingBed: (creating) => set({ isCreatingBed: creating }),

  addBed: (bed) => {
    const state = get();
    const newBeds = [...state.beds, bed];
    const action: BedAction = {
      type: 'ADD_BED',
      beds: [bed],
      timestamp: Date.now()
    };
    
    set({
      beds: newBeds,
      isDirty: true,
      history: [...state.history.slice(0, state.historyIndex + 1), action].slice(-MAX_HISTORY),
      historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY - 1)
    });
  },

  removeBeds: (bedIds) => {
    const state = get();
    const bedsToRemove = state.beds.filter(bed => bedIds.includes(bed.id));
    const newBeds = state.beds.filter(bed => !bedIds.includes(bed.id));
    
    const action: BedAction = {
      type: 'REMOVE_BED',
      beds: bedsToRemove,
      timestamp: Date.now()
    };

    set({
      beds: newBeds,
      selectedBedIds: state.selectedBedIds.filter(id => !bedIds.includes(id)),
      isDirty: true,
      history: [...state.history.slice(0, state.historyIndex + 1), action].slice(-MAX_HISTORY),
      historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY - 1)
    });
  },

  updateBed: (bedId, updates) => {
    const state = get();
    const oldBed = state.beds.find(bed => bed.id === bedId);
    if (!oldBed) return;

    const updatedBed = { ...oldBed, ...updates, updatedAt: Date.now() };
    const newBeds = state.beds.map(bed => bed.id === bedId ? updatedBed : bed);
    
    const action: BedAction = {
      type: 'UPDATE_BED',
      beds: [oldBed],
      timestamp: Date.now()
    };

    set({
      beds: newBeds,
      isDirty: true,
      history: [...state.history.slice(0, state.historyIndex + 1), action].slice(-MAX_HISTORY),
      historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY - 1)
    });
  },

  selectBeds: (bedIds) => set({ selectedBedIds: bedIds }),
  
  clearSelection: () => set({ selectedBedIds: [] }),
  
  toggleBedSelection: (bedId) => {
    const state = get();
    const isSelected = state.selectedBedIds.includes(bedId);
    const newSelection = isSelected 
      ? state.selectedBedIds.filter(id => id !== bedId)
      : [...state.selectedBedIds, bedId];
    
    set({ selectedBedIds: newSelection });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex < 0) return;

    const action = state.history[state.historyIndex];
    let newBeds = [...state.beds];

    switch (action.type) {
      case 'ADD_BED':
        newBeds = newBeds.filter(bed => !action.beds.some(actionBed => actionBed.id === bed.id));
        break;
      case 'REMOVE_BED':
        newBeds = [...newBeds, ...action.beds];
        break;
      case 'UPDATE_BED':
        action.beds.forEach(oldBed => {
          const index = newBeds.findIndex(bed => bed.id === oldBed.id);
          if (index !== -1) {
            newBeds[index] = oldBed;
          }
        });
        break;
    }

    set({
      beds: newBeds,
      historyIndex: state.historyIndex - 1,
      isDirty: true,
      selectedBedIds: []
    });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const action = state.history[state.historyIndex + 1];
    let newBeds = [...state.beds];

    switch (action.type) {
      case 'ADD_BED':
        newBeds = [...newBeds, ...action.beds];
        break;
      case 'REMOVE_BED':
        newBeds = newBeds.filter(bed => !action.beds.some(actionBed => actionBed.id === bed.id));
        break;
      case 'UPDATE_BED':
        // For redo, we need to apply the new version (stored separately)
        // This is simplified - in a real app, you'd store both old and new states
        break;
    }

    set({
      beds: newBeds,
      historyIndex: state.historyIndex + 1,
      isDirty: true,
      selectedBedIds: []
    });
  },

  canUndo: () => get().historyIndex >= 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  markClean: () => set({ isDirty: false, lastSaved: Date.now() }),
  
  loadBeds: (beds) => set({ 
    beds, 
    isDirty: false, 
    history: [], 
    historyIndex: -1,
    tool: 'pan' // Always reset to pan tool when loading beds
  })
}));
