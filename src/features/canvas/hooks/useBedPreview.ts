
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
    console.log('useBedPreview.startPreview called with tool:', tool);
    
    // Allow creation tools and mobile double-tap
    if (tool !== 'create-rectangle' && tool !== 'create-circle' && tool !== 'pan') {
      console.log('Invalid tool for preview:', tool);
      return;
    }

    const worldPos = screenToWorld(screenX, screenY, viewport);
    const bedPosition = calculateBedPosition(worldPos, bedConfig.shape, bedConfig, gridSize);
    
    console.log('Starting preview at world position:', worldPos, 'bed position:', bedPosition);
    
    setCursorPosition({ x: screenX, y: screenY });
    setIsCreating(true);

    // Create base preview bed
    const baseBed = createBaseBed(bedPosition, bedConfig);
    const previewGroup = createPreviewBedGroup(baseBed, bedConfig);
    const collision = checkPreviewCollision(previewGroup, beds, bedConfig.spacing);
    
    console.log('Created preview group:', previewGroup, 'collision:', collision);
    
    setPreviewBeds(previewGroup);
    setHasCollision(collision);
  }, [viewport, bedConfig, gridSize, beds, setCursorPosition, setIsCreating, setPreviewBeds, setHasCollision]);

  const updatePreview = useCallback((screenX: number, screenY: number) => {
    console.log('useBedPreview.updatePreview called, isCreating:', isCreating, 'previewBeds length:', previewBeds.length);
    
    if (!isCreating) {
      console.log('Not creating, skipping preview update');
      return;
    }

    setCursorPosition({ x: screenX, y: screenY });
    updatePreviewPosition(screenX, screenY);
  }, [isCreating, setCursorPosition, updatePreviewPosition]);

  const updatePreviewWithConfig = useCallback((updates: Partial<BedConfig>) => {
    console.log('useBedPreview.updatePreviewWithConfig called with updates:', updates);
    
    if (previewBeds.length === 0 || !cursorPosition) {
      console.log('No preview beds or cursor position, skipping config update');
      return;
    }
    
    updatePreviewWithConfigBase(updates, cursorPosition);
  }, [previewBeds.length, cursorPosition, updatePreviewWithConfigBase]);

  const clearPreview = useCallback(() => {
    console.log('useBedPreview.clearPreview called');
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
