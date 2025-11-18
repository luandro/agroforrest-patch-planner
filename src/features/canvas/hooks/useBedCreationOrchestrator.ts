
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
import { CanvasTool } from '../types/bed.types';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateBedConfig = useCallback(
    createBedConfigUpdater(updateBedConfigBase, updatePreviewWithConfig),
    [updateBedConfigBase, updatePreviewWithConfig]
  );

  // Clear preview when tool changes
  const handleToolChange = useCallback((newTool: CanvasTool) => {
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

  // Enhanced placement manager that directly places beds without configuration
  const {
    placeBed: placeBedEnhanced,
    confirmPlacement,
    cancelPlacement
  } = createPlacementManager(
    placeBedBase,
    confirmPlacementBase,
    cancelPlacementBase,
    clearPreview,
    clearPlacement,
    () => previewBed,           
    () => cursorPosition        
  );

  // Modified placeBed that directly places without showing configuration
  const placeBed = useCallback(() => {
    if (previewBed) {
      // On mobile, directly place the bed using current configuration
      placeBedEnhanced();
    }
  }, [previewBed, placeBedEnhanced]);

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
    handleToolChange,
    // Expose these for tool orchestration
    clearPreview,
    clearPlacement
  };
};
