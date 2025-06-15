
import { CanvasViewport } from '../types/canvas.types';
import { Bed, BedConfig } from '../types/bed.types';

/**
 * Enhanced bed config update handler that also updates preview
 */
export const createBedConfigUpdater = (
  updateBedConfigBase: (updates: Partial<BedConfig>) => void,
  updatePreviewWithConfig: (updates: Partial<BedConfig>) => void
) => {
  return (updates: Partial<BedConfig>) => {
    updateBedConfigBase(updates);
    updatePreviewWithConfig(updates);
  };
};

/**
 * Enhanced preview management with tool awareness
 */
export const createPreviewManager = (
  startPreviewBase: (screenX: number, screenY: number, tool: string) => void,
  updatePreviewBase: (screenX: number, screenY: number) => void,
  tool: string
) => {
  const startPreview = (screenX: number, screenY: number) => {
    startPreviewBase(screenX, screenY, tool);
  };

  const updatePreview = (screenX: number, screenY: number) => {
    updatePreviewBase(screenX, screenY);
  };

  return { startPreview, updatePreview };
};

/**
 * Enhanced placement management with creation mode handling
 */
export const createPlacementManager = (
  placeBedBase: (previewBed: Bed | null) => void,
  confirmPlacementBase: () => boolean,
  cancelPlacementBase: (cursorPosition: { x: number; y: number } | null) => any,
  clearPreview: () => void,
  clearPlacement: () => void,
  previewBed: Bed | null,
  cursorPosition: { x: number; y: number } | null
) => {
  const placeBed = () => {
    // Don't clear preview here - let confirmation panel handle the flow
    placeBedBase(previewBed);
  };

  const confirmPlacement = () => {
    const shouldExitCreation = confirmPlacementBase();
    
    // Clear preview after successful confirmation
    clearPreview();
    
    // If not in multi-creation mode, exit creation
    if (shouldExitCreation) {
      // This will be handled by the canvas component
    }
  };

  const cancelPlacement = () => {
    const result = cancelPlacementBase(cursorPosition);
    
    if (result.resumePreview && result.bed) {
      // Resume preview at cursor position - this would need to be handled by parent
      // For now, just clear everything to maintain existing behavior
      clearPreview();
    } else {
      clearPreview();
    }
  };

  const cancelCreation = () => {
    clearPreview();
    clearPlacement();
  };

  return {
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation
  };
};
