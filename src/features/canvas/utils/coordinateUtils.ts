
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

export const convertToScreenCoordinates = (
  bed: Bed, 
  viewport: CanvasViewport, 
  canvasWidth: number, 
  canvasHeight: number
) => {
  const pixelsPerMeter = 50 * viewport.zoom;
  
  // Convert to display coordinates (accounting for device pixel ratio)
  const displayWidth = canvasWidth / (window.devicePixelRatio || 1);
  const displayHeight = canvasHeight / (window.devicePixelRatio || 1);
  
  const screenX = (displayWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
  const screenY = (displayHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;
  
  return { screenX, screenY, pixelsPerMeter };
};
