
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
 * 
 * Accepts a getter for the previewBed to avoid stale closures.
 */
export const createPlacementManager = (
  placeBedBase: (previewBed: Bed | null) => void,
  confirmPlacementBase: () => boolean,
  cancelPlacementBase: (cursorPosition: { x: number; y: number } | null) => any,
  clearPreview: () => void,
  clearPlacement: () => void,
  getPreviewBed: () => Bed | null,  // <-- instead of stale previewBed
  getCursorPosition: () => { x: number; y: number } | null
) => {
  /**
   * On placeBed, fetches the latest preview bed and passes it to placement.
   * (Moved from closure to runtime getter.)
   */
  const placeBed = () => {
    placeBedBase(getPreviewBed());
  };

  const confirmPlacement = () => {
    const shouldExitCreation = confirmPlacementBase();
    clearPreview();
    if (shouldExitCreation) {
      // The canvas will exit creation mode.
    }
  };

  const cancelPlacement = () => {
    const result = cancelPlacementBase(getCursorPosition());

    if (result.resumePreview && result.bed) {
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
