
import { useCallback } from 'react';
import { BedConfig } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { screenToWorld, calculateBedPosition } from '../utils/bedPositioning';
import { createBaseBed, createPreviewBedGroup } from '../utils/previewBedCreator';
import { checkPreviewCollision } from '../utils/previewCollisionDetector';
import { usePreviewState } from '../utils/previewStateManager';
import { usePreviewUpdateHandler } from '../utils/previewUpdateHandler';
import { useBedStore } from '../stores/bedStore';

interface UseBedPreviewProps {
  viewport: CanvasViewport;
  bedConfig: BedConfig;
  gridSize: number;
}

export const useBedPreview = ({ viewport, bedConfig, gridSize }: UseBedPreviewProps) => {
  const { beds } = useBedStore();
  
  const {
    isCreating,
    previewBeds,
    cursorPosition,
    hasCollision,
    setIsCreating,
    setPreviewBeds,
    setCursorPosition,
    setHasCollision,
    clearAll
  } = usePreviewState();

  const {
    updatePreviewPosition,
    updatePreviewWithConfig: updatePreviewWithConfigBase
  } = usePreviewUpdateHandler({
    viewport,
    bedConfig,
    gridSize,
    existingBeds: beds,
    setPreviewBeds,
    setHasCollision
  });

  const startPreview = useCallback((screenX: number, screenY: number, tool: string) => {
    if (tool !== 'create-rectangle' && tool !== 'create-circle') return;

    const worldPos = screenToWorld(screenX, screenY, viewport);
    const bedPosition = calculateBedPosition(worldPos, bedConfig.shape, bedConfig, gridSize);
    
    setCursorPosition({ x: screenX, y: screenY });
    setIsCreating(true);

    // Create base preview bed
    const baseBed = createBaseBed(bedPosition, bedConfig);
    const previewGroup = createPreviewBedGroup(baseBed, bedConfig);
    const collision = checkPreviewCollision(previewGroup, beds, bedConfig.spacing);
    
    setPreviewBeds(previewGroup);
    setHasCollision(collision);
  }, [viewport, bedConfig, gridSize, beds, setCursorPosition, setIsCreating, setPreviewBeds, setHasCollision]);

  const updatePreview = useCallback((screenX: number, screenY: number) => {
    if (!isCreating || previewBeds.length === 0) return;

    setCursorPosition({ x: screenX, y: screenY });
    updatePreviewPosition(screenX, screenY);
  }, [isCreating, previewBeds.length, setCursorPosition, updatePreviewPosition]);

  const updatePreviewWithConfig = useCallback((updates: Partial<BedConfig>) => {
    if (previewBeds.length === 0 || !cursorPosition) return;
    
    updatePreviewWithConfigBase(updates, cursorPosition);
  }, [previewBeds.length, cursorPosition, updatePreviewWithConfigBase]);

  const clearPreview = useCallback(() => {
    clearAll();
  }, [clearAll]);

  return {
    isCreating,
    previewBed: previewBeds[0] || null, // For backward compatibility
    previewBeds,
    hasCollision,
    cursorPosition,
    startPreview,
    updatePreview,
    updatePreviewWithConfig,
    clearPreview
  };
};
