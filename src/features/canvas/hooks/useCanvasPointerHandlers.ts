
import { useCallback } from 'react';
import { CanvasTool } from '../types/bed.types';
import { usePlantPlacement } from './usePlantPlacement';
import { usePlantSelection } from './usePlantSelection';

interface UseCanvasPointerHandlersProps {
  tool: CanvasTool;
  isCreating: boolean;
  focusedBed?: any;
  viewport?: any;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  isPlacing: boolean;
  startPreview: (x: number, y: number) => void;
  updatePreview: (x: number, y: number) => void;
  placeBed: () => void;
  startSelection: (x: number, y: number, isMultiSelect: boolean) => void;
  updateSelection: (x: number, y: number) => void;
  finishSelection: () => void;
  onCloseContextMenu: () => void;
}

export const useCanvasPointerHandlers = ({
  tool,
  isCreating,
  focusedBed,
  viewport,
  canvasRef,
  isPlacing,
  startPreview,
  updatePreview,
  placeBed,
  startSelection,
  updateSelection,
  finishSelection,
  onCloseContextMenu
}: UseCanvasPointerHandlersProps) => {
  // Plant placement hook
  const {
    handlePlacementPreview,
    handlePlantPlacement,
    handleEmptyAreaClick
  } = usePlantPlacement({
    viewport,
    focusedBed,
    canvasRef
  });

  // Plant selection hook
  const {
    isAreaSelecting,
    handlePlantSelection,
    startAreaSelection,
    updateAreaSelection,
    finishAreaSelection,
    getPlantAtCanvasPosition
  } = usePlantSelection({
    focusedBed,
    viewport,
    canvasRef
  });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isMultiSelect = e.shiftKey || e.ctrlKey;

    // Close any open context menu
    onCloseContextMenu();

    // Handle focus mode interactions
    if (focusedBed) {
      if (isPlacing) {
        // Plant placement mode
        handlePlantPlacement(x, y);
        return;
      } else {
        // Plant selection mode
        const plantSelected = handlePlantSelection(x, y, isMultiSelect);
        if (!plantSelected && !isMultiSelect) {
          // Start area selection
          startAreaSelection(x, y);
        }
        return;
      }
    }

    // Regular bed creation/selection modes
    if (tool === 'create-rectangle' || tool === 'create-circle') {
      startPreview(x, y);
    } else if (tool === 'select') {
      startSelection(x, y, isMultiSelect);
    }
    
    // Handle empty area clicks to cancel placement
    if (tool === 'pan' && isPlacing) {
      handleEmptyAreaClick();
    }
  }, [
    tool, 
    startPreview, 
    startSelection, 
    focusedBed, 
    isPlacing, 
    handlePlantPlacement, 
    handlePlantSelection,
    startAreaSelection,
    handleEmptyAreaClick,
    onCloseContextMenu
  ]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle focus mode interactions
    if (focusedBed) {
      if (isPlacing) {
        // Plant placement preview
        handlePlacementPreview(x, y);
        return;
      } else {
        // Area selection update
        if (isAreaSelecting) {
          updateAreaSelection(x, y);
        }
        return;
      }
    }

    // Regular canvas interactions
    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      updatePreview(x, y);
    } else {
      updateSelection(x, y);
    }
  }, [
    isCreating, 
    tool, 
    updatePreview, 
    updateSelection, 
    focusedBed, 
    isPlacing, 
    handlePlacementPreview,
    isAreaSelecting,
    updateAreaSelection
  ]);

  const handlePointerUp = useCallback(() => {
    // Handle focus mode interactions
    if (focusedBed) {
      if (isPlacing) {
        // Plant placement is handled in pointerDown
        return;
      } else if (isAreaSelecting) {
        // Finish area selection
        finishAreaSelection();
        return;
      }
    }

    // Regular canvas interactions
    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      placeBed();
    } else {
      finishSelection();
    }
  }, [
    isCreating, 
    tool, 
    placeBed, 
    finishSelection, 
    focusedBed, 
    isPlacing,
    isAreaSelecting,
    finishAreaSelection
  ]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getPlantAtCanvasPosition
  };
};
