import { create } from 'zustand';
import { HistoryState, HistoryActions } from './types';
import { Bed } from '../types/bed.types';
import { useBedState } from './bedState';

interface HistoryStore extends HistoryState, HistoryActions {}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [[]],
  historyIndex: 0,

  addToHistory: (beds: Bed[]) => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...beds]);
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      set({ historyIndex: state.historyIndex + 1 });
    }
    
    set({ history: newHistory });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const bedsAtIndex = [...state.history[newIndex]];
      
      // Update bed state
      const bedState = useBedState.getState();
      bedState._setBeds(bedsAtIndex);
      bedState._setDirty(true);
      
      set({ historyIndex: newIndex });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const bedsAtIndex = [...state.history[newIndex]];
      
      // Update bed state
      const bedState = useBedState.getState();
      bedState._setBeds(bedsAtIndex);
      bedState._setDirty(true);
      
      set({ historyIndex: newIndex });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1
}));
