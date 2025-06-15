
import { useCallback, useEffect } from 'react';
import { useBedStore } from '../stores/bedStore';
import { useOfflineStorage } from './useOfflineStorage';
import { useCanvasViewport } from './useCanvasViewport';
import { useCanvasInitialization } from './useCanvasInitialization';
import { usePatchStore } from '../stores/patchStore';
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
  const { currentPatchId } = usePatchStore();

  // Unified offline storage
  const storage = useOfflineStorage();

  // Debug logging for storage initialization
  useEffect(() => {
    console.log('🔧 Canvas state orchestrator initialized');
    console.log('📦 Storage status:', {
      currentPatch: currentPatchId,
      isInitialized: storage.isInitialized,
      isSaving: storage.isSaving,
      isDirty: storage.isDirty,
      errors: storage.saveErrors
    });
  }, [currentPatchId, storage.isInitialized, storage.isSaving, storage.isDirty]);

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
    
    // Storage state
    isSaving: storage.isSaving,
    isStorageInitialized: storage.isInitialized,
    
    // Store reference for other hooks
    bedStore
  };
};
