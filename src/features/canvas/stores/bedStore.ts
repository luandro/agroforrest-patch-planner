
import { useEffect, useMemo } from 'react';
import { useBedState } from './bedState';
import { useFocusModeStore } from './focusModeStore';
import { useHistoryStore } from './historyStore';
import { usePlantPlacementStore } from './plantPlacementStore';
import { usePatchStore } from './patchStore';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from './plantPlacementStore';

// Re-export the combined store interface for backward compatibility
export const useBedStore = () => {
  const bedState = useBedState();
  const focusModeStore = useFocusModeStore();
  const historyStore = useHistoryStore();
  const plantPlacementState = usePlantPlacementStore();
  const patchState = usePatchStore();

  const { activePatchId } = patchState;

  // Memoize filtered beds and placements for performance
  const bedsForActivePatch = useMemo(() => {
    return bedState.beds.filter(b => b.patchId === activePatchId);
  }, [bedState.beds, activePatchId]);

  const placementsForActivePatch = useMemo(() => {
    return plantPlacementState.placements.filter(p => p.patchId === activePatchId);
  }, [plantPlacementState.placements, activePatchId]);


  // Centralized history management for undo/redo for the active patch
  useEffect(() => {
    if (!activePatchId) return;
    
    const unsubscribe = useBedState.subscribe(
      state => state.beds.filter(b => b.patchId === activePatchId),
      (beds, prevBeds) => {
        if (JSON.stringify(beds) !== JSON.stringify(prevBeds)) {
          historyStore.addToHistory(beds);
        }
      },
      { fireImmediately: false }
    );
    
    // Reset history when patch changes
    historyStore.resetHistory();

    return unsubscribe;
  }, [historyStore, activePatchId]);


  // Enhanced actions that are now patch-aware
  const addBed = (bed: Omit<Bed, 'patchId'>) => {
    if (!activePatchId) return;
    bedState.addBed({ ...bed, patchId: activePatchId });
  };

  const addPlacement = (placement: Omit<PlantPlacement, 'patchId'| 'id' | 'plantedAt'>) => {
    if (!activePatchId) return;
    plantPlacementState.addPlacement({ ...placement, patchId: activePatchId });
  };

  const updateBed = (id: string, updates: Partial<Bed>) => {
    bedState.updateBed(id, updates);
  };
  
  const removeBeds = (ids: string[]) => {
    if (focusModeStore.focusMode.bedId && ids.includes(focusModeStore.focusMode.bedId)) {
      focusModeStore.exitFocusMode();
    }
    
    const { clearPlacementsForBed } = usePlantPlacementStore.getState();
    ids.forEach(bedId => clearPlacementsForBed(bedId));

    bedState.removeBeds(ids);
  };
  
  const removeBedsForPatch = (patchId: string) => {
      bedState.removeBedsForPatch(patchId);
  }

  return {
    // Patch state
    patches: patchState.patches,
    activePatchId: patchState.activePatchId,
    setActivePatchId: patchState.setActivePatchId,

    // Bed state for active patch
    beds: bedsForActivePatch,
    selectedBedIds: bedState.selectedBedIds,
    tool: bedState.tool,
    isDirty: bedState.isDirty || plantPlacementState.isDirty || patchState.isDirty,
    
    // Plant placement state
    placements: placementsForActivePatch,

    // Focus mode state
    focusMode: focusModeStore.focusMode,
    
    // History state
    history: historyStore.history,
    historyIndex: historyStore.historyIndex,
    
    // Enhanced actions
    addBed,
    updateBed,
    removeBeds,
    removeBedsForPatch,
    addPlacement,
    
    // Direct bed actions
    selectBeds: bedState.selectBeds,
    clearSelection: bedState.clearSelection,
    toggleBedSelection: bedState.toggleBedSelection,
    setTool: bedState.setTool,
    
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
export { usePatchStore } from './patchStore';
export type { FocusMode, BedState, BedActions, HistoryState, HistoryActions, FocusModeActions } from './types';
