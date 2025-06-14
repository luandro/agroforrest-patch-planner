
import { useState, useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { screenToWorld, calculateBedPosition, calculateBedFootprint, checkCollision } from '../utils/bedPositioning';
import { useBedStore } from '../stores/bedStore';

interface UseBedPreviewProps {
  viewport: CanvasViewport;
  bedConfig: BedConfig;
  gridSize: number;
}

export const useBedPreview = ({ viewport, bedConfig, gridSize }: UseBedPreviewProps) => {
  const { beds } = useBedStore();
  const [isCreating, setIsCreating] = useState(false);
  const [previewBeds, setPreviewBeds] = useState<Bed[]>([]);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [hasCollision, setHasCollision] = useState(false);

  const createPreviewBedGroup = useCallback((baseBed: Bed): Bed[] => {
    const beds: Bed[] = [];
    
    for (let i = 0; i < bedConfig.quantity; i++) {
      // Calculate offset for parallel placement
      const offsetY = i * (
        (baseBed.shape === 'rectangle' ? baseBed.dimensions.width || bedConfig.width : (baseBed.dimensions.radius || bedConfig.length) * 2) + 
        (bedConfig.spacing * 2)
      );
      
      const bed: Bed = {
        id: `preview-${Date.now()}-${i}`,
        shape: baseBed.shape,
        position: {
          x: baseBed.position.x,
          y: baseBed.position.y + offsetY
        },
        dimensions: baseBed.dimensions,
        rotation: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      beds.push(bed);
    }

    return beds;
  }, [bedConfig]);

  const checkPreviewCollision = useCallback((previewBeds: Bed[]): boolean => {
    for (const previewBed of previewBeds) {
      const footprint = calculateBedFootprint(previewBed, bedConfig.spacing);
      
      // Check against existing beds
      for (const existingBed of beds) {
        const existingFootprint = calculateBedFootprint(existingBed, bedConfig.spacing);
        if (checkCollision(footprint, existingFootprint)) {
          return true;
        }
      }
      
      // Check against other preview beds
      for (const otherPreviewBed of previewBeds) {
        if (previewBed.id !== otherPreviewBed.id) {
          const otherFootprint = calculateBedFootprint(otherPreviewBed, bedConfig.spacing);
          if (checkCollision(footprint, otherFootprint)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }, [beds, bedConfig.spacing]);

  const startPreview = useCallback((screenX: number, screenY: number, tool: string) => {
    if (tool !== 'create-rectangle' && tool !== 'create-circle') return;

    const worldPos = screenToWorld(screenX, screenY, viewport);
    const bedPosition = calculateBedPosition(worldPos, bedConfig.shape, bedConfig, gridSize);
    
    setCursorPosition({ x: screenX, y: screenY });
    setIsCreating(true);

    // Create base preview bed
    const baseBed: Bed = {
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

    const previewGroup = createPreviewBedGroup(baseBed);
    const collision = checkPreviewCollision(previewGroup);
    
    setPreviewBeds(previewGroup);
    setHasCollision(collision);
  }, [viewport, bedConfig, gridSize, createPreviewBedGroup, checkPreviewCollision]);

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
  }, [isCreating, previewBeds, viewport, bedConfig, gridSize, checkPreviewCollision]);

  const updatePreviewWithConfig = useCallback((updates: Partial<BedConfig>) => {
    if (previewBeds.length === 0 || !cursorPosition) return;
    
    const newConfig = { ...bedConfig, ...updates };
    const worldPos = screenToWorld(cursorPosition.x, cursorPosition.y, viewport);
    const snappedPos = calculateBedPosition(worldPos, updates.shape || previewBeds[0].shape, newConfig, gridSize);
    
    // Create new preview beds with updated config
    const baseBed: Bed = {
      id: `preview-${Date.now()}`,
      shape: updates.shape || previewBeds[0].shape,
      position: snappedPos,
      dimensions: updates.shape === 'rectangle' 
        ? { length: updates.length || bedConfig.length, width: updates.width || bedConfig.width }
        : { radius: updates.length || bedConfig.length },
      rotation: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Temporarily update bedConfig for preview generation
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
  }, [previewBeds, cursorPosition, bedConfig, viewport, gridSize, checkPreviewCollision]);

  const clearPreview = useCallback(() => {
    setIsCreating(false);
    setPreviewBeds([]);
    setCursorPosition(null);
    setHasCollision(false);
  }, []);

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
