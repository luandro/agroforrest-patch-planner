
import { useCallback, useEffect } from 'react';
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

  // Automatically trigger focus mode on single selection
  useEffect(() => {
    if (selectedBedIds.length === 1 && onEnterFocus) {
      onEnterFocus(selectedBedIds[0]);
    } else if ((selectedBedIds.length === 0 || selectedBedIds.length > 1) && onExitFocus) {
      onExitFocus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBedIds, onEnterFocus, onExitFocus]);

  // These handlers just update selection, auto-focus is now done in useEffect
  const handleSelectionChange = useCallback((newSelectedIds: string[]) => {
    selectBeds(newSelectedIds);
  }, [selectBeds]);

  const handleClearSelection = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return {
    selectedBedIds,
    handleSelectionChange,
    handleClearSelection,
    toggleBedSelection
  };
};
