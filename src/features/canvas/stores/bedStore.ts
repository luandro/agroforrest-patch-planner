import { useEffect } from 'react';
import { useBedState } from './bedState';
import { useFocusModeStore } from './focusModeStore';
import { useHistoryStore } from './historyStore';
import { usePlantPlacementStore } from './plantPlacementStore';
import { Bed } from '../types/bed.types';

// Re-export the combined store interface for backward compatibility
export const useBedStore = () => {
  const bedState = useBedState();
  const focusModeStore = useFocusModeStore();
  const historyStore = useHistoryStore();

  // Centralized history management for undo/redo
  // This ensures that any change to `beds` is captured.
  useEffect(() => {
    const unsubscribe = useBedState.subscribe(
      state => state.beds,
      (beds, prevBeds) => {
        // Prevent adding duplicate states, which can happen with some actions.
        if (JSON.stringify(beds) !== JSON.stringify(prevBeds)) {
          historyStore.addToHistory(beds);
        }
      },
      { fireImmediately: false } // Don't add history on component mount
    );
    return unsubscribe;
  }, [historyStore]);


  // Enhanced actions that no longer need to manually manage history
  const addBed = (bed: Bed) => {
    bedState.addBed(bed);
  };

  const updateBed = (id: string, updates: Partial<Bed>) => {
    bedState.updateBed(id, updates);
  };

  const removeBeds = (ids: string[]) => {
    // Check if we need to exit focus mode
    if (focusModeStore.focusMode.bedId && ids.includes(focusModeStore.focusMode.bedId)) {
      focusModeStore.exitFocusMode();
    }
    
    // Clear placements for each removed bed
    const { clearPlacementsForBed } = usePlantPlacementStore.getState();
    ids.forEach(bedId => {
      clearPlacementsForBed(bedId);
    });

    bedState.removeBeds(ids);
  };

  const loadBeds = (beds: Bed[]) => {
    bedState.loadBeds(beds);
    // `loadBeds` is a special case that resets the history to a new baseline.
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
    
    // Enhanced bed actions (with history now managed by useEffect)
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
export { usePlantPlacementStore } from './plantPlacementStore';
export type { FocusMode, BedState, BedActions, HistoryState, HistoryActions, FocusModeActions } from './types';
