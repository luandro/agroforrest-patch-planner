
import { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';

interface UseCoordinateTransformsProps {
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useCoordinateTransforms = ({ viewport, canvasRef }: UseCoordinateTransformsProps) => {
  // Convert canvas-relative coordinates to world coordinates
  const canvasToWorld = useCallback((canvasX: number, canvasY: number): { x: number; y: number } => {
    const canvas = canvasRef?.current;
    if (!canvas) return { x: 0, y: 0 };

    // Get canvas display dimensions
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Scale factor: pixels per meter in world space
    const pixelsPerMeter = 50 * viewport.zoom;
    
    // Convert canvas-relative coordinates to world coordinates with proper centering
    const worldX = viewport.centerX + (canvasX - displayWidth / 2) / pixelsPerMeter;
    const worldY = viewport.centerY - (canvasY - displayHeight / 2) / pixelsPerMeter;
    
    return { x: worldX, y: worldY };
  }, [viewport, canvasRef]);

  return {
    canvasToWorld
  };
};
