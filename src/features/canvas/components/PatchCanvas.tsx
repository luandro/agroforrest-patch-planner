
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
    setTool, 
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
    placementBed,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    startPreview,
    updatePreview,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation
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
    
    // Exit creation mode if not in multi-creation mode
    if (!multiCreationMode) {
      setTool('pan');
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

  return (
    <CanvasLayout
      viewport={viewport}
      updateViewport={updateViewport}
      beds={beds}
      selectedBedIds={selectedBedIds}
      tool={tool}
      setTool={setTool}
      bedConfig={bedConfig}
      updateBedConfig={updateBedConfig}
      isCreating={isCreating}
      previewBed={previewBed}
      placementBed={placementBed}
      showConfirmation={showConfirmation}
      multiCreationMode={multiCreationMode}
      setMultiCreationMode={setMultiCreationMode}
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
