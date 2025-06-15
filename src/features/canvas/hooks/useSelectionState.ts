
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

  // Handle selection changes without automatic focus mode
  const handleSelectionChange = useCallback((newSelectedIds: string[]) => {
    selectBeds(newSelectedIds);
    // Remove automatic focus mode trigger - let user explicitly enter focus mode
  }, [selectBeds]);

  // Handle clearing selection without automatic focus exit
  const handleClearSelection = useCallback(() => {
    clearSelection();
    // Remove automatic focus mode exit - let user explicitly exit focus mode
  }, [clearSelection]);

  return {
    selectedBedIds,
    handleSelectionChange,
    handleClearSelection,
    toggleBedSelection
  };
};
