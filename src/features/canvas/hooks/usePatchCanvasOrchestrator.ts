
import { useRef, useState, useEffect } from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasViewport } from './useCanvasViewport';
import { useBedCreation } from './useBedCreation';
import { useBedSelection } from './useBedSelection';
import { useBedFocus } from './useBedFocus';
import { useAutoSave } from './useAutoSave';
import { useBedStore } from '../stores/bedStore';
import { useIsMobile } from '@/hooks/use-mobile';

export const usePatchCanvasOrchestrator = ({
  initialViewport,
  onViewportChange,
  onOpenPlantSelection,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5,
}: PatchCanvasProps) => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCollapsed, onToggleCollapse] = useState(false);

  const { viewport, pan, zoomTo, updateViewport, centerOnBed, fitAllBeds } = useCanvasViewport({
    initialViewport,
    minZoom,
    maxZoom,
    onViewportChange,
  });

  const { tool, beds, selectedBedIds, undo, redo, canUndo, canRedo } = useBedStore();

  // Add focus mode integration
  const { 
    focusMode, 
    isInFocusMode, 
    focusedBedId, 
    enterFocusMode, 
    exitFocusMode 
  } = useBedFocus({
    viewport,
    updateViewport
  });

  // Focus mode handlers
  const handleEnterFocus = (bedId: string) => {
    enterFocusMode(bedId);
  };

  const handleExitFocus = () => {
    exitFocusMode();
  };

  // Exit focus mode when switching to creation tools
  useEffect(() => {
    if (isInFocusMode && (tool === 'create-rectangle' || tool === 'create-circle')) {
      handleExitFocus();
    }
  }, [tool, isInFocusMode]);

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

  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelection({ 
    viewport, 
    canvasRef,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus
  });

  const { isSaving } = useAutoSave();

  // Find the focused bed for rendering
  const focusedBed = focusedBedId ? beds.find(bed => bed.id === focusedBedId) : null;

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'create-rectangle' || tool === 'create-circle') {
      startPreview(x, y);
    } else if (tool === 'select') {
      const isMultiSelect = e.shiftKey || e.ctrlKey;
      startSelection(x, y, isMultiSelect);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      updatePreview(x, y);
    } else {
      updateSelection(x, y);
    }
  };

  const handlePointerUp = () => {
    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      placeBed();
    } else {
      finishSelection();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isMobile && tool === 'pan') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      startPreview(x, y);
      setTimeout(() => {
        placeBed();
      }, 10);
    }
  };

  const handleConfirmPlacement = () => {
    confirmPlacement();
    if (!multiCreationMode) {
      handleToolChange('pan');
    }
  };

  const handleCancelPlacement = () => {
    cancelPlacement();
  };

  const handleZoomIn = () => {
    zoomTo(Math.min(maxZoom, viewport.zoom * 1.2));
  };

  const handleZoomOut = () => {
    zoomTo(Math.max(minZoom, viewport.zoom / 1.2));
  };

  const handleFitAll = () => {
    fitAllBeds(beds);
  };

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
    onOpenPlantSelection,
    // Focus mode props
    isInFocusMode,
    focusedBedId,
    focusedBed,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus,
  };

  return {
    canvasRef,
    isCollapsed,
    onToggleCollapse,
    layoutProps,
  };
};
