
import { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { useBedStore } from '../stores/bedStore';
import { useBedConfiguration } from './useBedConfiguration';
import { useBedPreview } from './useBedPreview';
import { useBedPlacement } from './useBedPlacement';
import { checkCollision } from '../utils/bedPositioning';
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
  const { tool } = useBedStore();

  // Bed configuration management
  const { bedConfig, updateBedConfig: updateBedConfigBase } = useBedConfiguration();

  // Bed preview management
  const {
    isCreating,
    previewBed,
    cursorPosition,
    startPreview: startPreviewBase,
    updatePreview: updatePreviewBase,
    updatePreviewWithConfig,
    clearPreview
  } = useBedPreview({ viewport, bedConfig, gridSize });

  // Bed placement management
  const {
    placementBed,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
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

  const { startPreview, updatePreview } = createPreviewManager(
    startPreviewBase,
    updatePreviewBase,
    tool
  );

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
    previewBed,
    cursorPosition
  );

  return {
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
    cancelCreation,
    checkCollision
  };
};
