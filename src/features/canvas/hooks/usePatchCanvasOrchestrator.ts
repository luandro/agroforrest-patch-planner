
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

  const { beds, selectedBedIds, undo, redo, canUndo, canRedo } = useBedStore();

  // Focus mode integration
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
    handleToolChange,
  } = useBedCreationFlow({
    viewport,
    gridSize,
    onBedCreated: (bedId) => {
      setTimeout(() => {
        // centerOnBed is a placeholder in useCanvasViewport and doesn't have access to beds.
        // This functionality can be enhanced in a future step.
        // centerOnBed(bedId, 2.0);
      }, 100);
    },
  });

  // Tool management
  const { tool, setTool } = useCanvasTools({
    isInFocusMode,
    handleExitFocus: () => {
      handleExitFocus();
      cancelPlantPlacement(); // Cancel plant placement when exiting focus
    },
    handleToolChange
  });

  // Bed selection management
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelectionFlow({ 
    viewport, 
    canvasRef
  });

  // Event handlers
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  } = useCanvasEventHandlers({
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
    // Plant placement props
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
