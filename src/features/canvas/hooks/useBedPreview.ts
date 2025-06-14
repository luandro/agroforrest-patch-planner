
import { useState, useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { screenToWorld, calculateBedPosition } from '../utils/bedPositioning';

interface UseBedPreviewProps {
  viewport: CanvasViewport;
  bedConfig: BedConfig;
  gridSize: number;
}

export const useBedPreview = ({ viewport, bedConfig, gridSize }: UseBedPreviewProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [previewBed, setPreviewBed] = useState<Bed | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

  const startPreview = useCallback((screenX: number, screenY: number, tool: string) => {
    if (tool !== 'create-rectangle' && tool !== 'create-circle') return;

    const worldPos = screenToWorld(screenX, screenY, viewport);
    const bedPosition = calculateBedPosition(worldPos, bedConfig.shape, bedConfig, gridSize);
    
    setCursorPosition({ x: screenX, y: screenY });
    setIsCreating(true);

    // Create preview bed with proper positioning
    const previewBedData: Bed = {
      id: `preview-${Date.now()}`,
      shape: bedConfig.shape,
      position: bedPosition,
      dimensions: bedConfig.shape === 'rectangle' 
        ? { length: bedConfig.length, width: bedConfig.width }
        : { radius: bedConfig.length },
      rotation: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setPreviewBed(previewBedData);
  }, [viewport, bedConfig, gridSize]);

  const updatePreview = useCallback((screenX: number, screenY: number) => {
    if (!isCreating || !previewBed) return;

    const worldPos = screenToWorld(screenX, screenY, viewport);
    const bedPosition = calculateBedPosition(worldPos, previewBed.shape, bedConfig, gridSize);
    
    setCursorPosition({ x: screenX, y: screenY });

    setPreviewBed({
      ...previewBed,
      position: bedPosition
    });
  }, [isCreating, previewBed, viewport, bedConfig, gridSize]);

  const updatePreviewWithConfig = useCallback((updates: Partial<BedConfig>) => {
    // Update preview bed with new config if we're in preview mode
    if (previewBed && cursorPosition) {
      const worldPos = screenToWorld(cursorPosition.x, cursorPosition.y, viewport);
      const snappedPos = calculateBedPosition(worldPos, updates.shape || previewBed.shape, { ...bedConfig, ...updates }, gridSize);
      
      const updatedPreview: Bed = {
        ...previewBed,
        shape: updates.shape || previewBed.shape,
        dimensions: updates.shape === 'rectangle' 
          ? { length: updates.length || bedConfig.length, width: updates.width || bedConfig.width }
          : { radius: updates.length || bedConfig.length },
        position: snappedPos
      };
      
      setPreviewBed(updatedPreview);
    }
  }, [previewBed, cursorPosition, bedConfig, viewport, gridSize]);

  const clearPreview = useCallback(() => {
    setIsCreating(false);
    setPreviewBed(null);
    setCursorPosition(null);
  }, []);

  return {
    isCreating,
    previewBed,
    cursorPosition,
    startPreview,
    updatePreview,
    updatePreviewWithConfig,
    clearPreview
  };
};
