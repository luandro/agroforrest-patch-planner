
import { useState, useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { CANVAS, DEFAULT_VIEWPORT } from '../config';

interface UseCanvasViewportProps {
  initialViewport?: Partial<CanvasViewport>;
  minZoom?: number;
  maxZoom?: number;
  onViewportChange?: (viewport: CanvasViewport) => void;
}

export const useCanvasViewport = ({
  initialViewport = {},
  minZoom = CANVAS.MIN_ZOOM,
  maxZoom = CANVAS.MAX_ZOOM,
  onViewportChange
}: UseCanvasViewportProps) => {
  const [viewport, setViewport] = useState<CanvasViewport>({
    ...DEFAULT_VIEWPORT,
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
      newViewport.width = CANVAS.DEFAULT_WIDTH / newViewport.zoom;
      newViewport.height = CANVAS.DEFAULT_HEIGHT / newViewport.zoom;
      
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
    console.log('Pan called with delta:', { deltaX, deltaY });
    
    setViewport(prev => {
      // Improved scaling factor calculation
      const scaleFactor = CANVAS.PIXELS_PER_METER * prev.zoom;

      // Apply deltas with proper Y-axis handling (no inversion needed)
      const newCenterX = prev.centerX - deltaX / scaleFactor;
      const newCenterY = prev.centerY - deltaY / scaleFactor;

      // Apply boundaries (prevent panning too far)
      const boundedX = Math.max(CANVAS.PAN_MIN, Math.min(CANVAS.PAN_MAX, newCenterX));
      const boundedY = Math.max(CANVAS.PAN_MIN, Math.min(CANVAS.PAN_MAX, newCenterY));
      
      console.log('Pan result:', {
        from: { x: prev.centerX, y: prev.centerY },
        to: { x: boundedX, y: boundedY },
        scaleFactor
      });
      
      const newViewport = {
        ...prev,
        centerX: boundedX,
        centerY: boundedY
      };
      
      onViewportChange?.(newViewport);
      return newViewport;
    });
  }, [onViewportChange]);

  // Center on a specific bed with optional zoom
  const centerOnBed = useCallback((_bedId: string, _targetZoom?: number) => {
    // This would need access to beds store, so we'll implement it in the component
    // For now, just provide the function signature
  }, []);

  // Fit all beds in view with padding
  const fitAllBeds = useCallback((beds: Bed[]) => {
    if (beds.length === 0) return;

    // Calculate bounding box of all beds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    beds.forEach(bed => {
      const { position, dimensions, shape } = bed;
      
      if (shape === 'rectangle') {
        const halfLength = (dimensions.length || 1) / 2;
        const halfWidth = (dimensions.width || 1) / 2;
        
        minX = Math.min(minX, position.x - halfLength);
        maxX = Math.max(maxX, position.x + halfLength);
        minY = Math.min(minY, position.y - halfWidth);
        maxY = Math.max(maxY, position.y + halfWidth);
      } else {
        const radius = dimensions.radius || 0.5;
        
        minX = Math.min(minX, position.x - radius);
        maxX = Math.max(maxX, position.x + radius);
        minY = Math.min(minY, position.y - radius);
        maxY = Math.max(maxY, position.y + radius);
      }
    });

    // Add 10% padding
    const width = maxX - minX;
    const height = maxY - minY;
    const padding = Math.max(width, height) * 0.1;
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Calculate zoom to fit with padding
    const viewWidth = width + padding * 2;
    const viewHeight = height + padding * 2;
    const requiredZoom = Math.min(CANVAS.DEFAULT_WIDTH / viewWidth, CANVAS.DEFAULT_HEIGHT / viewHeight);
    const targetZoom = Math.max(minZoom, Math.min(maxZoom, requiredZoom));
    
    // Animate to new viewport
    updateViewport({
      centerX,
      centerY,
      zoom: targetZoom
    });
  }, [minZoom, maxZoom, updateViewport]);

  return {
    viewport,
    updateViewport,
    panTo,
    zoomTo,
    pan,
    centerOnBed,
    fitAllBeds
  };
};
