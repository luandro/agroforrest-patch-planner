
import { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { useBedStore } from '../stores/bedStore';
import { useBedConfiguration } from './useBedConfiguration';
import { useBedPreview } from './useBedPreview';
import { useBedPlacement } from './useBedPlacement';
import { checkCollision } from '../utils/bedPositioning';

interface UseBedCreationProps {
  viewport: CanvasViewport;
  gridSize?: number;
  onBedCreated?: (bedId: string) => void;
}

export const useBedCreation = ({ viewport, gridSize = 1, onBedCreated }: UseBedCreationProps) => {
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

  // Enhanced bed config update that also updates preview
  const updateBedConfig = useCallback((updates: Partial<typeof bedConfig>) => {
    updateBedConfigBase(updates);
    updatePreviewWithConfig(updates);
  }, [updateBedConfigBase, updatePreviewWithConfig]);

  // Wrapper functions that maintain the same API
  const startPreview = useCallback((screenX: number, screenY: number) => {
    startPreviewBase(screenX, screenY, tool);
  }, [startPreviewBase, tool]);

  const updatePreview = useCallback((screenX: number, screenY: number) => {
    updatePreviewBase(screenX, screenY);
  }, [updatePreviewBase]);

  const placeBed = useCallback(() => {
    placeBedBase(previewBed);
    clearPreview();
  }, [placeBedBase, previewBed, clearPreview]);

  const confirmPlacement = useCallback(() => {
    const shouldExitCreation = confirmPlacementBase();
    
    // If not in multi-creation mode, exit creation
    if (shouldExitCreation) {
      // This will be handled by the canvas component
    }
  }, [confirmPlacementBase]);

  const cancelPlacement = useCallback(() => {
    const result = cancelPlacementBase(cursorPosition);
    
    if (result.resumePreview && result.bed) {
      // Resume preview at cursor position - this would need to be handled by parent
      // For now, just clear everything to maintain existing behavior
      clearPreview();
    } else {
      clearPreview();
    }
  }, [cancelPlacementBase, cursorPosition, clearPreview]);

  const cancelCreation = useCallback(() => {
    clearPreview();
    clearPlacement();
  }, [clearPreview, clearPlacement]);

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
