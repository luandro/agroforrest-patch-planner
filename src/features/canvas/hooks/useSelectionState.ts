
import { useCallback } from 'react';
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

  // Handle selection changes with automatic focus mode logic
  const handleSelectionChange = useCallback((newSelectedIds: string[]) => {
    const previousLength = selectedBedIds.length;
    selectBeds(newSelectedIds);
    
    // Trigger focus mode logic after selection update
    if (newSelectedIds.length === 1 && previousLength !== 1 && onEnterFocus) {
      // Use setTimeout to ensure state has updated
      setTimeout(() => onEnterFocus(newSelectedIds[0]), 0);
    } else if ((newSelectedIds.length === 0 || newSelectedIds.length > 1) && previousLength === 1 && onExitFocus) {
      // Use setTimeout to ensure state has updated
      setTimeout(() => onExitFocus(), 0);
    }
  }, [selectedBedIds.length, selectBeds, onEnterFocus, onExitFocus]);

  const handleClearSelection = useCallback(() => {
    const hadSingleSelection = selectedBedIds.length === 1;
    clearSelection();
    
    // Exit focus if we had a single selection
    if (hadSingleSelection && onExitFocus) {
      setTimeout(() => onExitFocus(), 0);
    }
  }, [clearSelection, selectedBedIds.length, onExitFocus]);

  return {
    selectedBedIds,
    handleSelectionChange,
    handleClearSelection,
    toggleBedSelection
  };
};
