
/**
 * Canvas utility functions for clearing, background, and basic setup
 */

import { Bed } from '../types/bed.types';

export const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const setCanvasBackground = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  focusedBed?: Bed | null
) => {
  ctx.fillStyle = focusedBed ? '#F0FDF4' : '#F9FAFB'; // Slightly green background in focus mode
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const getSnapHighlight = (
  previewBeds?: Bed[],
  previewBed?: Bed | null,
  placementBeds?: Bed[],
  placementBed?: Bed | null
): { x: number; y: number } | undefined => {
  // Show snap highlight for preview or placement bed (use first bed for position)
  if (previewBeds && previewBeds.length > 0) {
    return previewBeds[0].position;
  } else if (previewBed) {
    return previewBed.position;
  } else if (placementBeds && placementBeds.length > 0) {
    return placementBeds[0].position;
  } else if (placementBed) {
    return placementBed.position;
  }
  return undefined;
};
