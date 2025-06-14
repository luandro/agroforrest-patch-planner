
import { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { useBedStore } from '../stores/bedStore';
import { useBedConfiguration } from './useBedConfiguration';
import { useBedPreview } from './useBedPreview';
import { useBedPlacement } from './useBedPlacement';

interface UseBedCreationFlowProps {
  viewport: CanvasViewport;
  gridSize?: number;
  onBedCreated?: (bedId: string) => void;
}

export const useBedCreationFlow = ({ 
  viewport, 
  gridSize = 1, 
  onBedCreated 
}: UseBedCreationFlowProps) => {
  const { tool } = useBedStore();

  // Bed configuration management
  const { bedConfig, updateBedConfig } = useBedConfiguration();

  // Bed preview management
  const {
    isCreating,
    previewBed,
    previewBeds,
    hasCollision: previewHasCollision,
    cursorPosition,
    startPreview,
    updatePreview,
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
    placeBed,
    confirmPlacement,
    cancelPlacement,
    clearPlacement
  } = useBedPlacement({ bedConfig, onBedCreated });

  return {
    // Configuration
    bedConfig,
    updateBedConfig,
    tool,
    
    // Preview state
    isCreating,
    previewBed,
    previewBeds,
    cursorPosition,
    
    // Placement state
    placementBed,
    placementBeds,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    
    // Collision detection
    hasCollision: previewHasCollision || placementHasCollision,
    
    // Actions
    startPreview,
    updatePreview,
    updatePreviewWithConfig,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    clearPreview,
    clearPlacement
  };
};
