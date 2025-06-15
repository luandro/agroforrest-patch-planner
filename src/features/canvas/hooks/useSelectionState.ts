
import { useCallback, useState } from 'react';
import { useBedStore } from '../stores/bedStore';

interface UseSelectionStateProps {
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
}

export const useSelectionState = ({ onEnterFocus, onExitFocus }: UseSelectionStateProps) => {
  const { 
    selectedBedIds, 
    selectBeds, 
    clearSelection, 
    toggleBedSelection 
  } = useBedStore();

  // Handle focus mode when selection changes
  const handleSelectionChange = useCallback((newSelectedIds: string[]) => {
    selectBeds(newSelectedIds);
    
    // Trigger focus mode for single selection, exit for multiple or no selection
    if (newSelectedIds.length === 1) {
      onEnterFocus?.(newSelectedIds[0]);
    } else if (newSelectedIds.length !== 1) {
      onExitFocus?.();
    }
  }, [selectBeds, onEnterFocus, onExitFocus]);

  // Handle focus mode when clearing selection
  const handleClearSelection = useCallback(() => {
    clearSelection();
    onExitFocus?.();
  }, [clearSelection, onExitFocus]);

  return {
    selectedBedIds,
    handleSelectionChange,
    handleClearSelection,
    toggleBedSelection
  };
};
