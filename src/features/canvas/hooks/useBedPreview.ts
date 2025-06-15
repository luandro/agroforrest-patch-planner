
import { useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { screenToWorld, calculateBedPosition } from '../utils/bedPositioning';
import { useBedPreviewState } from './useBedPreviewState';
import { useBedPreviewCollision } from './useBedPreviewCollision';
import { useBedPreviewCreation } from './useBedPreviewCreation';

interface UseBedPreviewProps {
  viewport: CanvasViewport;
  bedConfig: BedConfig;
  gridSize: number;
}

export const useBedPreview = ({ viewport, bedConfig, gridSize }: UseBedPreviewProps) => {
  const {
    isCreating,
    setIsCreating,
    previewBeds,
    setPreviewBeds,
    cursorPosition,
    setCursorPosition,
    hasCollision,
    setHasCollision,
    clearPreview
  } = useBedPreviewState();

  const { checkPreviewCollision } = useBedPreviewCollision({ bedConfig });
  const { createPreviewBedGroup, createBaseBed } = useBedPreviewCreation({ bedConfig });

  const startPreview = useCallback((screenX: number, screenY: number, tool: string) => {
    if (tool !== 'create-rectangle' && tool !== 'create-circle') return;

    const worldPos = screenToWorld(screenX, screenY, viewport);
    const bedPosition = calculateBedPosition(worldPos, bedConfig.shape, bedConfig, gridSize);
    
    setCursorPosition({ x: screenX, y: screenY });
    setIsCreating(true);

    // Create base preview bed
    const baseBed = createBaseBed(bedPosition, bedConfig.shape);
    const previewGroup = createPreviewBedGroup(baseBed);
    const collision = checkPreviewCollision(previewGroup);
    
    setPreviewBeds(previewGroup);
    setHasCollision(collision);
  }, [viewport, bedConfig, gridSize, createBaseBed, createPreviewBedGroup, checkPreviewCollision, setCursorPosition, setIsCreating, setPreviewBeds, setHasCollision]);

  const updatePreview = useCallback((screenX: number, screenY: number) => {
    if (!isCreating || previewBeds.length === 0) return;

    const worldPos = screenToWorld(screenX, screenY, viewport);
    const bedPosition = calculateBedPosition(worldPos, previewBeds[0].shape, bedConfig, gridSize);
    
    setCursorPosition({ x: screenX, y: screenY });

    // Update all preview beds with new position
    const updatedPreviewBeds = previewBeds.map((bed, index) => {
      const offsetY = index * (
        (bed.shape === 'rectangle' ? bed.dimensions.width || bedConfig.width : (bed.dimensions.radius || bedConfig.length) * 2) + 
        (bedConfig.spacing * 2)
      );
      
      return {
        ...bed,
        position: {
          x: bedPosition.x,
          y: bedPosition.y + offsetY
        }
      };
    });

    const collision = checkPreviewCollision(updatedPreviewBeds);
    
    setPreviewBeds(updatedPreviewBeds);
    setHasCollision(collision);
  }, [isCreating, previewBeds, viewport, bedConfig, gridSize, checkPreviewCollision, setCursorPosition, setPreviewBeds, setHasCollision]);

  const updatePreviewWithConfig = useCallback((updates: Partial<BedConfig>) => {
    if (previewBeds.length === 0 || !cursorPosition) return;
    
    const newConfig = { ...bedConfig, ...updates };
    const worldPos = screenToWorld(cursorPosition.x, cursorPosition.y, viewport);
    const snappedPos = calculateBedPosition(worldPos, updates.shape || previewBeds[0].shape, newConfig, gridSize);
    
    // Create new preview beds with updated config
    const baseBed = createBaseBed(snappedPos, updates.shape || previewBeds[0].shape);
    
    // Update baseBed dimensions based on new config
    if (updates.shape === 'rectangle' || (!updates.shape && baseBed.shape === 'rectangle')) {
      baseBed.dimensions = { 
        length: updates.length || bedConfig.length, 
        width: updates.width || bedConfig.width 
      };
    } else {
      baseBed.dimensions = { 
        radius: updates.length || bedConfig.length 
      };
    }
    
    // Create preview group with updated config
    const tempBedConfig = { ...bedConfig, ...updates };
    const previewGroup: Bed[] = [];
    
    for (let i = 0; i < tempBedConfig.quantity; i++) {
      const offsetY = i * (
        (baseBed.shape === 'rectangle' ? baseBed.dimensions.width || tempBedConfig.width : (baseBed.dimensions.radius || tempBedConfig.length) * 2) + 
        (tempBedConfig.spacing * 2)
      );
      
      const bed: Bed = {
        ...baseBed,
        id: `preview-${Date.now()}-${i}`,
        position: {
          x: baseBed.position.x,
          y: baseBed.position.y + offsetY
        }
      };

      previewGroup.push(bed);
    }
    
    const collision = checkPreviewCollision(previewGroup);
    
    setPreviewBeds(previewGroup);
    setHasCollision(collision);
  }, [previewBeds, cursorPosition, bedConfig, viewport, gridSize, checkPreviewCollision, createBaseBed, setPreviewBeds, setHasCollision]);

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
