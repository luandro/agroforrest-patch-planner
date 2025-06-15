
import { useCallback } from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasViewport } from './useCanvasViewport';
import { useAutoSave } from './useAutoSave';
import { useBedStore } from '../stores/bedStore';
import { useCanvasState } from './useCanvasState';
import { useCanvasFocusMode } from './useCanvasFocusMode';
import { useCanvasTools } from './useCanvasTools';
import { useCanvasEventHandlers } from './useCanvasEventHandlers';
import { useBedCreationFlow } from './useBedCreationFlow';
import { usePlantSelectionFlow } from './usePlantSelectionFlow';
import { useBedSelectionFlow } from './useBedSelectionFlow';
import { useCanvasLayoutProps } from './useCanvasLayoutProps';

export const usePatchCanvasOrchestrator = ({
  initialViewport,
  onViewportChange,
  onOpenPlantSelection,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5,
}: PatchCanvasProps) => {
  const { canvasRef, isCollapsed, onToggleCollapse } = useCanvasState();

  const { viewport, pan, zoomTo, updateViewport, fitAllBeds } = useCanvasViewport({
    initialViewport,
    minZoom,
    maxZoom,
    onViewportChange,
  });

  // Get store state
  const bedStore = useBedStore();
  const { beds, selectedBedIds, undo, redo, canUndo, canRedo, tool, setTool } = bedStore;

  // Create wrapper for fitAllBeds that doesn't require parameters
  const handleFitAllBeds = useCallback(() => {
    fitAllBeds(beds);
  }, [fitAllBeds, beds]);

  // Focus mode integration with stable callbacks
  const { 
    focusMode, 
    isInFocusMode, 
    focusedBedId, 
    handleEnterFocus, 
    handleExitFocus 
  } = useCanvasFocusMode({
    viewport,
    updateViewport
  });

  // Get the focused bed directly from the beds array using the focused bed ID
  const focusedBed = focusedBedId ? beds.find(bed => bed.id === focusedBedId) : null;

  // Plant selection flow
  const {
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect,
    cancelPlantPlacement
  } = usePlantSelectionFlow({
    viewport,
    focusedBed,
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
    cancelCreation,
    handleToolChange: bedCreationHandleToolChange,
  } = useBedCreationFlow({
    viewport,
    gridSize,
    onBedCreated: (bedId) => {
      setTimeout(() => {
        // centerOnBed is a placeholder in useCanvasViewport and doesn't have access to beds.
      }, 100);
    },
  });

  // Stable tool change handler
  const stableHandleToolChange = useCallback((newTool) => {
    setTool(newTool);
    bedCreationHandleToolChange(newTool);
  }, [setTool, bedCreationHandleToolChange]);

  // Tool management
  const { tool: activeTool } = useCanvasTools({
    isInFocusMode,
    handleExitFocus: () => {
      handleExitFocus();
      cancelPlantPlacement(); // Cancel plant placement when exiting focus
    },
    handleToolChange: stableHandleToolChange
  });

  // Bed selection management with stable focus handlers
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelectionFlow({ 
    viewport, 
    canvasRef,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus
  });

  // Event handlers
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  } = useCanvasEventHandlers({
    tool: activeTool,
    isCreating,
    multiCreationMode,
    startPreview,
    updatePreview,
    placeBed,
    startSelection,
    updateSelection,
    finishSelection,
    handleToolChange: stableHandleToolChange,
    viewport,
    focusedBed,
    canvasRef
  });

  const { isSaving } = useAutoSave();

  // Create layout props using the new hook
  const layoutProps = useCanvasLayoutProps({
    viewport,
    updateViewport,
    beds,
    selectedBedIds,
    tool: activeTool,
    handleToolChange: stableHandleToolChange,
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
    fitAllBeds: handleFitAllBeds,
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
