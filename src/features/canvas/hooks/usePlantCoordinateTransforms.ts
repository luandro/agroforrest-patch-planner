
import { useCallback } from 'react';
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';

interface UsePlantCoordinateTransformsProps {
  focusedBed: Bed | null;
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const usePlantCoordinateTransforms = ({
  focusedBed,
  viewport,
  canvasRef
}: UsePlantCoordinateTransformsProps) => {
  // Convert canvas coordinates to bed-relative coordinates
  const canvasToBedCoordinates = useCallback((canvasX: number, canvasY: number) => {
    if (!focusedBed || !canvasRef?.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const pixelsPerMeter = 50 * viewport.zoom;
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    const bedScreenX = (displayWidth / 2) + (focusedBed.position.x - viewport.centerX) * pixelsPerMeter;
    const bedScreenY = (displayHeight / 2) - (focusedBed.position.y - viewport.centerY) * pixelsPerMeter;
    
    const relativeX = (canvasX - bedScreenX) / pixelsPerMeter;
    const relativeY = -(canvasY - bedScreenY) / pixelsPerMeter;
    
    return { x: relativeX, y: relativeY };
  }, [focusedBed, viewport, canvasRef]);

  return {
    canvasToBedCoordinates
  };
};
