
import { useCallback } from 'react';
import type { Bed, CanvasTool } from '../types/bed.types';
import type { CanvasViewport } from '../types/canvas.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { usePlantSelection } from './usePlantSelection';
import { useCanvasPointerHandlers } from './useCanvasPointerHandlers';
import { useCanvasHoverState } from './useCanvasHoverState';
import { useCanvasContextMenu } from './useCanvasContextMenu';
import { useCanvasDoubleClick } from './useCanvasDoubleClick';

import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

interface UseCanvasEventHandlersProps {
  tool: CanvasTool;
  isCreating: boolean;
  multiCreationMode: boolean;
  startPreview: (x: number, y: number) => void;
  updatePreview: (x: number, y: number) => void;
  placeBed: () => void;
  startSelection: (x: number, y: number, isMultiSelect: boolean) => void;
  updateSelection: (x: number, y: number) => void;
  finishSelection: () => void;
  handleToolChange: (tool: CanvasTool) => void;
  viewport?: CanvasViewport;
  focusedBed?: Bed | null;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useCanvasEventHandlers = ({
  tool,
  isCreating,
  multiCreationMode,
  startPreview,
  updatePreview,
  placeBed,
  startSelection,
  updateSelection,
  finishSelection,
  handleToolChange,
  viewport,
  focusedBed,
  canvasRef
}: UseCanvasEventHandlersProps) => {
  const { isPlacing } = usePlantPlacementStore();
  
  // Hover state management
  const { hoveredPlacementId, updateHoveredPlacement } = useCanvasHoverState();
  
  // Context menu management
  const { contextMenuState, closeContextMenu, handleContextMenu } = useCanvasContextMenu();
  
  // Plant selection hook for access to utilities
  const {
    selectedPlacementIds,
    selectionArea,
    handlePlantSelection,
    getPlantAtCanvasPosition
  } = usePlantSelection({
    focusedBed,
    viewport,
    canvasRef
  });

  // Pointer event handlers
  const {
    handlePointerDown,
    handlePointerMove: baseHandlePointerMove,
    handlePointerUp
  } = useCanvasPointerHandlers({
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
    onCloseContextMenu: closeContextMenu
  });

  // Enhanced pointer move with hover detection
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    // Handle base pointer move logic
    baseHandlePointerMove(e);

    // Handle hover detection in focus mode
    if (focusedBed && !isPlacing) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const hoveredPlant = getPlantAtCanvasPosition(x, y);
      updateHoveredPlacement(hoveredPlant?.id || null);
    }
  }, [baseHandlePointerMove, focusedBed, isPlacing, getPlantAtCanvasPosition, updateHoveredPlacement]);

  // Double click handler
  const { handleDoubleClick } = useCanvasDoubleClick({
    tool,
    focusedBed,
    isPlacing,
    startPreview,
    placeBed,
    getPlantAtCanvasPosition,
    handlePlantSelection
  });

  // Context menu handler with dependencies
  const handleContextMenuWithDeps = useCallback((e: React.MouseEvent) => {
    handleContextMenu(e, focusedBed, isPlacing, getPlantAtCanvasPosition);
  }, [handleContextMenu, focusedBed, isPlacing, getPlantAtCanvasPosition]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    handleContextMenu: handleContextMenuWithDeps,
    hoveredPlacementId,
    selectedPlacementIds,
    selectionArea,
    contextMenuState,
    setContextMenuState: closeContextMenu
  };
};
