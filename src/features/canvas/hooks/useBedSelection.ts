
import { useCallback } from 'react';
import { useBedStore } from '../stores/bedStore';
import { CanvasViewport } from '../types/canvas.types';
import { useSelectionState } from './useSelectionState';
import { useSelectionArea } from './useSelectionArea';
import { useBedDragging } from './useBedDragging';
import { useCoordinateTransforms } from './useCoordinateTransforms';
import { useBedHitTesting } from './useBedHitTesting';

interface UseBedSelectionProps {
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
  onSelectionChange?: (bedIds: string[]) => void;
  onClearSelection?: () => void;
}

export const useBedSelection = ({ 
  viewport, 
  canvasRef, 
  onEnterFocus, 
  onExitFocus,
  onSelectionChange,
  onClearSelection
}: UseBedSelectionProps) => {
  const { removeBeds } = useBedStore();

  // Coordinate transformation utilities
  const { canvasToWorld } = useCoordinateTransforms({ viewport, canvasRef });

  // Selection state management - use passed handlers or internal focus handlers
  const { 
    selectedBedIds, 
    handleSelectionChange, 
    handleClearSelection, 
    toggleBedSelection 
  } = useSelectionState({ 
    onEnterFocus, 
    onExitFocus,
    onSelectionChange,
    onClearSelection
  });

  // Area selection functionality
  const {
    isSelecting,
    selectionArea,
    startAreaSelection,
    updateAreaSelection,
    finishAreaSelection,
    getSelectionBounds
  } = useSelectionArea();

  // Bed dragging functionality
  const {
    isDragging,
    startDragging,
    updateDragging,
    finishDragging
  } = useBedDragging();

  // Hit testing utilities
  const { getBedAtWorldPoint, getBedsInArea } = useBedHitTesting();

  // Find bed at canvas coordinates
  const getBedAtPoint = useCallback((canvasX: number, canvasY: number) => {
    const worldPos = canvasToWorld(canvasX, canvasY);
    return getBedAtWorldPoint(worldPos.x, worldPos.y);
  }, [canvasToWorld, getBedAtWorldPoint]);

  // Start selection (single click or area selection) - takes canvas-relative coordinates
  const startSelection = useCallback((canvasX: number, canvasY: number, isMultiSelect: boolean = false) => {
    const bed = getBedAtPoint(canvasX, canvasY);
    
    if (bed) {
      // Click on a bed
      if (isMultiSelect) {
        toggleBedSelection(bed.id);
        // Handle focus mode based on resulting selection
        const newSelection = selectedBedIds.includes(bed.id) 
          ? selectedBedIds.filter(id => id !== bed.id)
          : [...selectedBedIds, bed.id];
        
        if (newSelection.length === 1) {
          onEnterFocus?.(newSelection[0]);
        } else {
          onExitFocus?.();
        }
      } else {
        if (selectedBedIds.includes(bed.id)) {
          // Already selected, start dragging
          const worldPos = canvasToWorld(canvasX, canvasY);
          startDragging(worldPos.x, worldPos.y);
        } else {
          // Select this bed and enter focus mode
          handleSelectionChange([bed.id]);
        }
      }
    } else {
      // Click on empty space
      if (!isMultiSelect) {
        handleClearSelection();
      }
      
      // Start area selection
      const worldPos = canvasToWorld(canvasX, canvasY);
      startAreaSelection(worldPos.x, worldPos.y);
    }
  }, [getBedAtPoint, selectedBedIds, toggleBedSelection, handleSelectionChange, handleClearSelection, canvasToWorld, startDragging, startAreaSelection, onEnterFocus, onExitFocus]);

  // Update selection area or drag selected beds - takes canvas-relative coordinates
  const updateSelection = useCallback((canvasX: number, canvasY: number) => {
    const worldPos = canvasToWorld(canvasX, canvasY);

    if (isSelecting) {
      updateAreaSelection(worldPos.x, worldPos.y);
    } else if (isDragging) {
      updateDragging(worldPos.x, worldPos.y);
    }
  }, [isSelecting, isDragging, canvasToWorld, updateAreaSelection, updateDragging]);

  // Finish selection
  const finishSelection = useCallback(() => {
    if (isSelecting) {
      const bounds = getSelectionBounds();
      if (bounds) {
        const selectedIds = getBedsInArea(bounds.minX, bounds.maxX, bounds.minY, bounds.maxY);
        handleSelectionChange(selectedIds);
      }
      finishAreaSelection();
    }

    if (isDragging) {
      finishDragging();
    }
  }, [isSelecting, isDragging, getSelectionBounds, getBedsInArea, handleSelectionChange, finishAreaSelection, finishDragging]);

  // Delete selected beds
  const deleteSelected = useCallback(() => {
    if (selectedBedIds.length > 0) {
      removeBeds(selectedBedIds);
      onExitFocus?.(); // Exit focus mode when deleting
    }
  }, [selectedBedIds, removeBeds, onExitFocus]);

  return {
    selectedBedIds,
    selectionArea,
    isSelecting,
    isDragging,
    startSelection,
    updateSelection,
    finishSelection,
    deleteSelected,
    getBedAtPoint
  };
};
