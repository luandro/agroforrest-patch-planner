
import { useCallback, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasTool } from '../types/bed.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { usePlantPlacement } from './usePlantPlacement';
import { usePlantSelection } from './usePlantSelection';

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
  // Plant placement props
  viewport?: any;
  focusedBed?: any;
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
  const isMobile = useIsMobile();
  const { isPlacing } = usePlantPlacementStore();
  const [hoveredPlacementId, setHoveredPlacementId] = useState<string | null>(null);
  const [contextMenuState, setContextMenuState] = useState<{
    isOpen: boolean;
    placementId: string | null;
    x: number;
    y: number;
  }>({ isOpen: false, placementId: null, x: 0, y: 0 });
  
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
    selectedPlacementIds,
    isAreaSelecting,
    selectionArea,
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
    setContextMenuState({ isOpen: false, placementId: null, x: 0, y: 0 });

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
    handleEmptyAreaClick
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
        // Plant hover detection for visual feedback
        const hoveredPlant = getPlantAtCanvasPosition(x, y);
        setHoveredPlacementId(hoveredPlant?.id || null);
        
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
    getPlantAtCanvasPosition,
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

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle focus mode interactions
    if (focusedBed) {
      if (isPlacing) {
        return; // No double-click action in planting mode
      } else {
        // Double-click plant to enter quick edit mode
        const plant = getPlantAtCanvasPosition(x, y);
        if (plant) {
          // Select the plant and trigger edit mode
          handlePlantSelection(x, y, false);
          // The edit panel will appear automatically when plant is selected
          return;
        }
      }
    }

    // Regular mobile double-tap to place bed
    if (isMobile && tool === 'pan') {
      startPreview(x, y);
      setTimeout(() => {
        placeBed();
      }, 10);
    }
  }, [
    isMobile, 
    tool, 
    startPreview, 
    placeBed, 
    focusedBed, 
    isPlacing,
    getPlantAtCanvasPosition,
    handlePlantSelection
  ]);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!focusedBed || isPlacing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const plant = getPlantAtCanvasPosition(x, y);
    if (plant) {
      setContextMenuState({
        isOpen: true,
        placementId: plant.id,
        x: e.clientX,
        y: e.clientY
      });
    }
  }, [focusedBed, isPlacing, getPlantAtCanvasPosition]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    handleContextMenu,
    hoveredPlacementId,
    selectedPlacementIds,
    selectionArea,
    contextMenuState,
    setContextMenuState
  };
};
