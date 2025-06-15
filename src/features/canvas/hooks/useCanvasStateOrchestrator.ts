
import { useCallback, useRef } from 'react';
import { useBedStore } from '../stores/bedStore';
import { useAutoSaveBeds } from './useAutoSaveBeds';
import { useAutoSavePlants } from './useAutoSavePlants';
import { useCanvasViewport } from './useCanvasViewport';
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
  const { isSaving: isSavingBeds } = useAutoSaveBeds();
  const { isSaving: isSavingPlacements } = useAutoSavePlants();

  // Use ref to maintain stable reference to beds for fitAllBeds
  const bedsRef = useRef(beds);
  bedsRef.current = beds;

  // Create stable wrapper for fitAllBeds that uses ref to get current beds
  const handleFitAllBeds = useCallback(() => {
    fitAllBeds(bedsRef.current);
  }, [fitAllBeds]);

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
