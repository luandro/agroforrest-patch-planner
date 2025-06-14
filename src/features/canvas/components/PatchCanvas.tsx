import React from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasViewport } from '../hooks/useCanvasViewport';
import { useBedCreation } from '../hooks/useBedCreation';
import { useBedSelection } from '../hooks/useBedSelection';
import { useAutoSave } from '../hooks/useAutoSave';
import { useBedStore } from '../stores/bedStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasLayout } from './CanvasLayout';

export const PatchCanvas: React.FC<PatchCanvasProps> = ({
  initialViewport,
  onViewportChange,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5
}) => {
  const isMobile = useIsMobile();

  // Canvas viewport and rendering
  const { viewport, pan, zoomTo, updateViewport, centerOnBed, fitAllBeds } = useCanvasViewport({
    initialViewport,
    minZoom,
    maxZoom,
    onViewportChange
  });

  // Bed management
  const { 
    tool, 
    beds, 
    selectedBedIds,
    undo,
    redo,
    canUndo,
    canRedo
  } = useBedStore();

  // Enhanced bed creation with preview and confirmation
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
    handleToolChange
  } = useBedCreation({ 
    viewport, 
    gridSize, 
    onBedCreated: (bedId) => {
      setTimeout(() => {
        centerOnBed(bedId, 2.0);
      }, 100);
    }
  });

  // Bed selection
  const {
    startSelection,
    updateSelection,
    finishSelection,
    deleteSelected
  } = useBedSelection({ viewport });

  // Auto-save
  const { isSaving } = useAutoSave();

  // Handle canvas interactions based on current tool
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('PatchCanvas.handlePointerDown:', { tool, x, y, isCreating });

    if (tool === 'create-rectangle' || tool === 'create-circle') {
      console.log('Starting preview for creation tool');
      startPreview(x, y);
    } else if (tool === 'select') {
      console.log('Starting selection');
      const isMultiSelect = e.shiftKey || e.ctrlKey;
      startSelection(x, y, isMultiSelect);
    } else if (tool === 'pan') {
      console.log('Pan mode - no action on pointer down');
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      console.log('Updating preview during creation');
      updatePreview(x, y);
    } else if (tool === 'select') {
      updateSelection(x, y);
    }
  };

  const handlePointerUp = () => {
    console.log('PatchCanvas.handlePointerUp:', { tool, isCreating });
    
    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      console.log('Placing bed after creation');
      placeBed();
    } else if (tool === 'select') {
      finishSelection();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    console.log('PatchCanvas.handleDoubleClick:', { isMobile, tool });
    
    if (isMobile && tool === 'pan') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log('Mobile double-click creating bed at:', x, y);
      startPreview(x, y);
      setTimeout(() => {
        placeBed();
      }, 10);
    }
  };

  const handleConfirmPlacement = () => {
    console.log('PatchCanvas.handleConfirmPlacement');
    confirmPlacement();
    
    // Exit creation mode if not in multi-creation mode
    if (!multiCreationMode) {
      handleToolChange('pan');
    }
  };

  const handleCancelPlacement = () => {
    console.log('PatchCanvas.handleCancelPlacement');
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

  return (
    <CanvasLayout
      viewport={viewport}
      updateViewport={updateViewport}
      beds={beds}
      selectedBedIds={selectedBedIds}
      tool={tool}
      setTool={handleToolChange}
      bedConfig={bedConfig}
      updateBedConfig={updateBedConfig}
      isCreating={isCreating}
      previewBed={previewBed}
      previewBeds={previewBeds}
      placementBed={placementBed}
      placementBeds={placementBeds}
      showConfirmation={showConfirmation}
      multiCreationMode={multiCreationMode}
      setMultiCreationMode={setMultiCreationMode}
      hasCollision={hasCollision}
      handlePointerDown={handlePointerDown}
      handlePointerMove={handlePointerMove}
      handlePointerUp={handlePointerUp}
      handleDoubleClick={handleDoubleClick}
      handleConfirmPlacement={handleConfirmPlacement}
      handleCancelPlacement={handleCancelPlacement}
      pan={pan}
      zoomTo={zoomTo}
      handleZoomIn={handleZoomIn}
      handleZoomOut={handleZoomOut}
      handleFitAll={handleFitAll}
      undo={undo}
      redo={redo}
      canUndo={canUndo}
      canRedo={canRedo}
      deleteSelected={deleteSelected}
      isSaving={isSaving}
      cancelCreation={cancelCreation}
      gridSize={gridSize}
    />
  );
};

export default React.memo(PatchCanvas);
