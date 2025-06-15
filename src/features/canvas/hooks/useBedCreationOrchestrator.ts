
import { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { useBedStore } from '../stores/bedStore';
import { useBedConfiguration } from './useBedConfiguration';
import { useBedPreview } from './useBedPreview';
import { useBedPlacement } from './useBedPlacement';
import { 
  createBedConfigUpdater, 
  createPreviewManager, 
  createPlacementManager 
} from '../utils/bedCreationHelpers';

interface UseBedCreationOrchestratorProps {
  viewport: CanvasViewport;
  gridSize?: number;
  onBedCreated?: (bedId: string) => void;
}

export const useBedCreationOrchestrator = ({ 
  viewport, 
  gridSize = 1, 
  onBedCreated 
}: UseBedCreationOrchestratorProps) => {
  const { tool, setTool } = useBedStore();

  // Bed configuration management
  const { bedConfig, updateBedConfig: updateBedConfigBase } = useBedConfiguration();

  // Bed preview management
  const {
    isCreating,
    previewBed,
    previewBeds,
    hasCollision: previewHasCollision,
    cursorPosition,
    startPreview: startPreviewBase,
    updatePreview: updatePreviewBase,
    updatePreviewWithConfig,
    clearPreview
  } = useBedPreview({ viewport, bedConfig, gridSize });

  // Bed placement management
  const {
    placementBed,
    placementBeds,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    hasCollision: placementHasCollision,
    placeBed: placeBedBase,
    confirmPlacement: confirmPlacementBase,
    cancelPlacement: cancelPlacementBase,
    clearPlacement
  } = useBedPlacement({ bedConfig, onBedCreated });

  // Create enhanced handlers using utility functions
  const updateBedConfig = useCallback(
    createBedConfigUpdater(updateBedConfigBase, updatePreviewWithConfig),
    [updateBedConfigBase, updatePreviewWithConfig]
  );

  // Clear preview when tool changes
  const handleToolChange = useCallback((newTool: any) => {
    if (newTool !== tool) {
      clearPreview();
      clearPlacement();
    }
    setTool(newTool);
  }, [tool, clearPreview, clearPlacement, setTool]);

  const { startPreview, updatePreview } = createPreviewManager(
    startPreviewBase,
    updatePreviewBase,
    tool
  );

  // Pass getters for latest previewBed and cursorPosition!!
  const {
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation
  } = createPlacementManager(
    placeBedBase,
    confirmPlacementBase,
    cancelPlacementBase,
    clearPreview,
    clearPlacement,
    () => previewBed,           // getter for the latest preview bed
    () => cursorPosition        // getter for latest cursor pos
  );

  // Enhanced cancel creation that clears all states
  const cancelCreationEnhanced = useCallback(() => {
    clearPreview();
    clearPlacement();
    setTool('pan'); // Always return to pan mode
  }, [clearPreview, clearPlacement, setTool]);

  return {
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
    hasCollision: previewHasCollision || placementHasCollision,
    startPreview,
    updatePreview,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation: cancelCreationEnhanced,
    handleToolChange
  };
};
