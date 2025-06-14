
import { CanvasViewport } from '../types/canvas.types';
import { useBedCreationFlow } from './useBedCreationFlow';
import { useBedCreationHandlers } from './useBedCreationHandlers';

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
  // Get the main creation flow state and actions
  const flowState = useBedCreationFlow({ viewport, gridSize, onBedCreated });

  // Get enhanced handlers
  const handlers = useBedCreationHandlers({
    tool: flowState.tool,
    updateBedConfig: flowState.updateBedConfig,
    updatePreviewWithConfig: flowState.updatePreviewWithConfig,
    startPreview: flowState.startPreview,
    updatePreview: flowState.updatePreview,
    placeBed: flowState.placeBed,
    confirmPlacement: flowState.confirmPlacement,
    cancelPlacement: flowState.cancelPlacement,
    clearPreview: flowState.clearPreview,
    clearPlacement: flowState.clearPlacement,
    previewBed: flowState.previewBed,
    cursorPosition: flowState.cursorPosition
  });

  return {
    // State from flow
    bedConfig: flowState.bedConfig,
    isCreating: flowState.isCreating,
    previewBed: flowState.previewBed,
    previewBeds: flowState.previewBeds,
    placementBed: flowState.placementBed,
    placementBeds: flowState.placementBeds,
    showConfirmation: flowState.showConfirmation,
    multiCreationMode: flowState.multiCreationMode,
    setMultiCreationMode: flowState.setMultiCreationMode,
    hasCollision: flowState.hasCollision,
    
    // Enhanced handlers
    updateBedConfig: handlers.updateBedConfig,
    startPreview: handlers.startPreview,
    updatePreview: handlers.updatePreview,
    placeBed: handlers.placeBed,
    confirmPlacement: handlers.confirmPlacement,
    cancelPlacement: handlers.cancelPlacement,
    cancelCreation: handlers.cancelCreation,
    handleToolChange: handlers.handleToolChange
  };
};
