
import { useBedState } from './bedState';
import { useFocusModeStore } from './focusModeStore';
import { useHistoryStore } from './historyStore';
import { Bed, CanvasTool } from '../types/bed.types';

// Re-export the combined store interface for backward compatibility
export const useBedStore = () => {
  const bedState = useBedState();
  const focusModeStore = useFocusModeStore();
  const historyStore = useHistoryStore();

  // Enhanced actions that include history tracking
  const addBed = (bed: Bed) => {
    bedState.addBed(bed);
    historyStore.addToHistory(bedState.beds);
  };

  const updateBed = (id: string, updates: Partial<Bed>) => {
    bedState.updateBed(id, updates);
    historyStore.addToHistory(bedState.beds);
  };

  const removeBeds = (ids: string[]) => {
    // Check if we need to exit focus mode
    if (focusModeStore.focusMode.bedId && ids.includes(focusModeStore.focusMode.bedId)) {
      focusModeStore.exitFocusMode();
    }
    
    bedState.removeBeds(ids);
    historyStore.addToHistory(bedState.beds);
  };

  const loadBeds = (beds: Bed[]) => {
    bedState.loadBeds(beds);
    historyStore.addToHistory(beds);
  };

  return {
    // Bed state
    beds: bedState.beds,
    selectedBedIds: bedState.selectedBedIds,
    tool: bedState.tool,
    isDirty: bedState.isDirty,
    
    // Focus mode state
    focusMode: focusModeStore.focusMode,
    
    // History state
    history: historyStore.history,
    historyIndex: historyStore.historyIndex,
    
    // Enhanced bed actions (with history)
    addBed,
    updateBed,
    removeBeds,
    loadBeds,
    
    // Direct bed actions
    selectBeds: bedState.selectBeds,
    clearSelection: bedState.clearSelection,
    toggleBedSelection: bedState.toggleBedSelection,
    setTool: bedState.setTool,
    markClean: bedState.markClean,
    
    // Focus mode actions
    enterFocusMode: focusModeStore.enterFocusMode,
    exitFocusMode: focusModeStore.exitFocusMode,
    
    // History actions
    undo: historyStore.undo,
    redo: historyStore.redo,
    canUndo: historyStore.canUndo,
    canRedo: historyStore.canRedo,
    addToHistory: historyStore.addToHistory
  };
};

// Also export individual stores for more granular access if needed
export { useBedState } from './bedState';
export { useFocusModeStore } from './focusModeStore';
export { useHistoryStore } from './historyStore';
export type { FocusMode, BedState, BedActions, HistoryState, HistoryActions, FocusModeActions } from './types';
