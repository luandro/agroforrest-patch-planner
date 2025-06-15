
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasState } from './useCanvasState';
import { useCanvasStateOrchestrator } from './useCanvasStateOrchestrator';
import { useFocusModeIntegration } from './useFocusModeIntegration';
import { useBedCreationOrchestrator } from './useBedCreationOrchestrator';
import { useCanvasToolOrchestrator } from './useCanvasToolOrchestrator';
import { useBedSelectionFlow } from './useBedSelectionFlow';
import { useCanvasEventOrchestrator } from './useCanvasEventOrchestrator';
import { useCanvasLayoutBuilder } from './useCanvasLayoutBuilder';

export const usePatchCanvasOrchestrator = ({
  initialViewport,
  onViewportChange,
  onOpenPlantSelection,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5,
}: PatchCanvasProps) => {
  const { canvasRef, isCollapsed, onToggleCollapse } = useCanvasState();

  // State orchestration
  const {
    viewport,
    updateViewport,
    pan,
    zoomTo,
    fitAllBeds,
    beds,
    selectedBedIds,
    undo,
    redo,
    canUndo,
    canRedo,
    isSaving,
    bedStore
  } = useCanvasStateOrchestrator({
    initialViewport,
    onViewportChange,
    minZoom,
    maxZoom
  });

  // Focus mode integration
  const {
    focusMode,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    handleEnterFocus,
    handleExitFocus,
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect
  } = useFocusModeIntegration({
    viewport,
    updateViewport,
    beds,
    canvasRef,
    onOpenPlantSelection
  });

  // Bed creation management
  const {
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    previewBeds,
    placementBed,
    placementBeds,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    hasCollision,
    startPreview,
    updatePreview,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation: cancelCreationBase,
    clearPreview,
    clearPlacement
  } = useBedCreationOrchestrator({
    viewport,
    gridSize,
    onBedCreated: (bedId) => {
      setTimeout(() => {
        // centerOnBed is a placeholder in useCanvasViewport and doesn't have access to beds.
      }, 100);
    },
  });

  // Tool orchestration
  const { tool, handleToolChange } = useCanvasToolOrchestrator({
    isInFocusMode,
    handleExitFocus,
    clearPreview,
    clearPlacement,
    setTool: bedStore.setTool
  });

  // Bed selection management
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelectionFlow({ 
    viewport, 
    canvasRef,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus
  });

  // Event orchestration
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  } = useCanvasEventOrchestrator({
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
  });

  // Enhanced cancel creation that ensures tool reset
  const cancelCreation = () => {
    cancelCreationBase();
    handleToolChange('pan');
  };

  // Layout props building
  const layoutProps = useCanvasLayoutBuilder({
    viewport,
    updateViewport,
    beds,
    selectedBedIds,
    tool,
    handleToolChange,
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    previewBeds,
    placementBed,
    placementBeds,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    hasCollision,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    confirmPlacement,
    cancelPlacement,
    pan,
    zoomTo,
    undo,
    redo,
    canUndo,
    canRedo,
    deleteSelected,
    isSaving,
    cancelCreation,
    fitAllBeds,
    gridSize,
    minZoom,
    maxZoom,
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    handleEnterFocus,
    handleExitFocus
  });

  return {
    canvasRef,
    isCollapsed,
    onToggleCollapse,
    layoutProps,
  };
};
