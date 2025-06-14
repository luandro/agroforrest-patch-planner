
import { useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { screenToWorld, calculateBedPosition } from './bedPositioning';
import { createBaseBed, createPreviewBedGroup } from './previewBedCreator';
import { checkPreviewCollision } from './previewCollisionDetector';

interface UsePreviewUpdateHandlerProps {
  viewport: CanvasViewport;
  bedConfig: BedConfig;
  gridSize: number;
  existingBeds: Bed[];
  setPreviewBeds: (beds: Bed[]) => void;
  setHasCollision: (hasCollision: boolean) => void;
}

/**
 * Handles preview updates including position changes and configuration updates
 */
export const usePreviewUpdateHandler = ({
  viewport,
  bedConfig,
  gridSize,
  existingBeds,
  setPreviewBeds,
  setHasCollision
}: UsePreviewUpdateHandlerProps) => {

  const createAndUpdatePreview = useCallback((
    worldPos: { x: number; y: number },
    config: BedConfig
  ) => {
    const bedPosition = calculateBedPosition(worldPos, config.shape, config, gridSize);
    const baseBed = createBaseBed(bedPosition, config);
    const previewGroup = createPreviewBedGroup(baseBed, config);
    const collision = checkPreviewCollision(previewGroup, existingBeds, config.spacing);
    
    setPreviewBeds(previewGroup);
    setHasCollision(collision);
  }, [viewport, gridSize, existingBeds, setPreviewBeds, setHasCollision]);

  const updatePreviewPosition = useCallback((screenX: number, screenY: number) => {
    const worldPos = screenToWorld(screenX, screenY, viewport);
    createAndUpdatePreview(worldPos, bedConfig);
  }, [viewport, bedConfig, createAndUpdatePreview]);

  const updatePreviewWithConfig = useCallback((
    updates: Partial<BedConfig>,
    cursorPosition: { x: number; y: number } | null
  ) => {
    if (!cursorPosition) return;
    
    const newConfig = { ...bedConfig, ...updates };
    const worldPos = screenToWorld(cursorPosition.x, cursorPosition.y, viewport);
    createAndUpdatePreview(worldPos, newConfig);
  }, [bedConfig, viewport, createAndUpdatePreview]);

  return {
    updatePreviewPosition,
    updatePreviewWithConfig
  };
};
