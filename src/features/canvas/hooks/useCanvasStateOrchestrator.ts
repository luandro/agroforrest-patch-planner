
import { useCallback } from 'react';
import { useBedStore } from '../stores/bedStore';
import { useAutoSave } from './useAutoSave';
import { useAutoSavePlants } from './useAutoSavePlants';
import { useCanvasViewport } from './useCanvasViewport';
import { useCanvasInitialization } from './useCanvasInitialization';
import { PatchCanvasProps } from '../types/canvas.types';

interface UseCanvasStateOrchestratorProps {
  initialViewport: PatchCanvasProps['initialViewport'];
  onViewportChange: PatchCanvasProps['onViewportChange'];
  minZoom: number;
  maxZoom: number;
}

export const useCanvasStateOrchestrator = ({
  initialViewport,
  onViewportChange,
  minZoom,
  maxZoom
}: UseCanvasStateOrchestratorProps) => {
  // Viewport management
  const { viewport, pan, zoomTo, updateViewport, fitAllBeds } = useCanvasViewport({
    initialViewport,
    minZoom,
    maxZoom,
    onViewportChange,
  });

  // Store state
  const bedStore = useBedStore();
  const { beds, selectedBedIds, undo, redo, canUndo, canRedo } = bedStore;

  // Auto-save state
  const { isSaving: isSavingBeds } = useAutoSave();
  const { isSaving: isSavingPlacements } = useAutoSavePlants();

  // Initialize canvas to home position
  useCanvasInitialization({
    updateViewport,
    beds
  });

  // Create wrapper for fitAllBeds that doesn't require parameters
  const handleFitAllBeds = useCallback(() => {
    fitAllBeds(beds);
  }, [fitAllBeds, beds]);

  return {
    // Viewport
    viewport,
    updateViewport,
    pan,
    zoomTo,
    fitAllBeds: handleFitAllBeds,
    
    // Bed state
    beds,
    selectedBedIds,
    
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Auto-save
    isSaving: isSavingBeds || isSavingPlacements,
    
    // Store reference for other hooks
    bedStore
  };
};
