
import { useCallback } from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasViewport } from './useCanvasViewport';
import { useBedCreation } from './useBedCreation';
import { useBedSelection } from './useBedSelection';
import { useAutoSave } from './useAutoSave';
import { useBedStore } from '../stores/bedStore';
import { useCanvasState } from './useCanvasState';
import { useCanvasFocusMode } from './useCanvasFocusMode';
import { useCanvasTools } from './useCanvasTools';
import { useCanvasEventHandlers } from './useCanvasEventHandlers';
import { usePlantPlacement } from './usePlantPlacement';

export const usePatchCanvasOrchestrator = ({
  initialViewport,
  onViewportChange,
  onOpenPlantSelection,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5,
}: PatchCanvasProps) => {
  const { canvasRef, isCollapsed, onToggleCollapse } = useCanvasState();

  const { viewport, pan, zoomTo, updateViewport, centerOnBed, fitAllBeds } = useCanvasViewport({
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

  // Find the focused bed for rendering and plant placement
  const focusedBed = focusedBedId ? beds.find(bed => bed.id === focusedBedId) : null;

  // Plant placement integration
  const {
    selectSpeciesForPlacement,
    cancelPlacement: cancelPlantPlacement
  } = usePlantPlacement({
    viewport,
    focusedBed,
    canvasRef
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
  } = useBedCreation({
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
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelection({ 
    viewport, 
    canvasRef,
    onEnterFocus: handleEnterFocus,
    onExitFocus: () => {
      handleExitFocus();
      cancelPlantPlacement(); // Cancel plant placement when exiting focus
    }
  });

  // Enhanced plant selection handler that integrates with both systems
  const handlePlantSelectionOpen = useCallback(() => {
    if (onOpenPlantSelection) {
      onOpenPlantSelection();
    }
  }, [onOpenPlantSelection]);

  const handlePlantSpeciesSelect = useCallback((species: any) => {
    selectSpeciesForPlacement(species);
  }, [selectSpeciesForPlacement]);

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

  const handleConfirmPlacement = useCallback(() => {
    confirmPlacement();
    if (!multiCreationMode) {
      handleToolChange('pan');
    }
  }, [confirmPlacement, multiCreationMode, handleToolChange]);

  const handleCancelPlacement = useCallback(() => {
    cancelPlacement();
  }, [cancelPlacement]);

  const handleZoomIn = useCallback(() => {
    zoomTo(Math.min(maxZoom, viewport.zoom * 1.2));
  }, [zoomTo, maxZoom, viewport.zoom]);

  const handleZoomOut = useCallback(() => {
    zoomTo(Math.max(minZoom, viewport.zoom / 1.2));
  }, [zoomTo, minZoom, viewport.zoom]);

  const handleFitAll = useCallback(() => {
    fitAllBeds(beds);
  }, [fitAllBeds, beds]);

  const layoutProps = {
    viewport,
    updateViewport,
    beds,
    selectedBedIds,
    tool,
    setTool: handleToolChange,
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
    handleConfirmPlacement,
    handleCancelPlacement,
    pan,
    zoomTo,
    handleZoomIn,
    handleZoomOut,
    handleFitAll,
    undo,
    redo,
    canUndo,
    canRedo,
    deleteSelected,
    isSaving,
    cancelCreation,
    gridSize: isInFocusMode ? 0.1 : gridSize, // Use fine grid in focus mode
    onOpenPlantSelection: handlePlantSelectionOpen,
    // Focus mode props
    isInFocusMode,
    focusedBedId,
    focusedBed,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus,
    // Plant placement integration
    onSelectPlantSpecies: handlePlantSpeciesSelect,
  };

  return {
    canvasRef,
    isCollapsed,
    onToggleCollapse,
    layoutProps,
  };
};
