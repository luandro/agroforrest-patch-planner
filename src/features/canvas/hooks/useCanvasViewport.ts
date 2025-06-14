
import { useState, useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';

interface UseCanvasViewportProps {
  initialViewport?: Partial<CanvasViewport>;
  minZoom?: number;
  maxZoom?: number;
  onViewportChange?: (viewport: CanvasViewport) => void;
}

export const useCanvasViewport = ({
  initialViewport = {},
  minZoom = 0.5,
  maxZoom = 5,
  onViewportChange
}: UseCanvasViewportProps) => {
  const [viewport, setViewport] = useState<CanvasViewport>({
    zoom: 1,
    centerX: 10, // Center of 20m x 20m area
    centerY: 10,
    width: 20,
    height: 20,
    ...initialViewport
  });

  const updateViewport = useCallback((updates: Partial<CanvasViewport>) => {
    setViewport(prev => {
      const newViewport = {
        ...prev,
        ...updates,
        zoom: Math.max(minZoom, Math.min(maxZoom, updates.zoom ?? prev.zoom))
      };
      
      // Update viewport dimensions based on zoom
      const baseWidth = 20;
      const baseHeight = 20;
      newViewport.width = baseWidth / newViewport.zoom;
      newViewport.height = baseHeight / newViewport.zoom;
      
      onViewportChange?.(newViewport);
      return newViewport;
    });
  }, [minZoom, maxZoom, onViewportChange]);

  const panTo = useCallback((centerX: number, centerY: number) => {
    updateViewport({ centerX, centerY });
  }, [updateViewport]);

  const zoomTo = useCallback((zoom: number, centerX?: number, centerY?: number) => {
    const updates: Partial<CanvasViewport> = { zoom };
    if (centerX !== undefined) updates.centerX = centerX;
    if (centerY !== undefined) updates.centerY = centerY;
    updateViewport(updates);
  }, [updateViewport]);

  const pan = useCallback((deltaX: number, deltaY: number) => {
    setViewport(prev => {
      const newCenterX = prev.centerX - deltaX / (50 * prev.zoom); // Scale based on zoom
      const newCenterY = prev.centerY + deltaY / (50 * prev.zoom); // Invert Y for natural feel
      
      // Apply boundaries (prevent panning too far)
      const boundedX = Math.max(-50, Math.min(50, newCenterX));
      const boundedY = Math.max(-50, Math.min(50, newCenterY));
      
      const newViewport = {
        ...prev,
        centerX: boundedX,
        centerY: boundedY
      };
      
      onViewportChange?.(newViewport);
      return newViewport;
    });
  }, [onViewportChange]);

  return {
    viewport,
    updateViewport,
    panTo,
    zoomTo,
    pan
  };
};
