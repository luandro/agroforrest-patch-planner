
import { useCallback } from 'react';
import { useBedStore } from '../stores/bedStore';

interface UseSelectionStateProps {
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
  onSelectionChange?: (bedIds: string[]) => void;
  onClearSelection?: () => void;
}

export const useSelectionState = ({ 
  onEnterFocus, 
  onExitFocus,
  onSelectionChange,
  onClearSelection
}: UseSelectionStateProps) => {
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
    
    // Use custom handler if provided, otherwise use focus mode logic
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    } else {
      // Trigger focus mode logic after selection update
      if (newSelectedIds.length === 1 && previousLength !== 1 && onEnterFocus) {
        // Use setTimeout to ensure state has updated
        setTimeout(() => onEnterFocus(newSelectedIds[0]), 0);
      } else if ((newSelectedIds.length === 0 || newSelectedIds.length > 1) && previousLength === 1 && onExitFocus) {
        // Use setTimeout to ensure state has updated
        setTimeout(() => onExitFocus(), 0);
      }
    }
  }, [selectedBedIds.length, selectBeds, onEnterFocus, onExitFocus, onSelectionChange]);

  const handleClearSelection = useCallback(() => {
    const hadSingleSelection = selectedBedIds.length === 1;
    clearSelection();
    
    // Use custom handler if provided, otherwise use focus mode logic
    if (onClearSelection) {
      onClearSelection();
    } else {
      // Exit focus if we had a single selection
      if (hadSingleSelection && onExitFocus) {
        setTimeout(() => onExitFocus(), 0);
      }
    }
  }, [clearSelection, selectedBedIds.length, onExitFocus, onClearSelection]);

  return {
    selectedBedIds,
    handleSelectionChange,
    handleClearSelection,
    toggleBedSelection
  };
};
