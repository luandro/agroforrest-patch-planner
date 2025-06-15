import { useState, useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { useBedStore } from '../stores/bedStore';
import { checkCollision, calculateBedFootprint } from '../utils/bedPositioning';
import { usePatchStore } from '../stores/patchStore';

interface UseBedPlacementProps {
  bedConfig: BedConfig;
  onBedCreated?: (bedId: string) => void;
}

export const useBedPlacement = ({ bedConfig, onBedCreated }: UseBedPlacementProps) => {
  const { addBed, beds } = useBedStore();
  const { activePatchId } = usePatchStore();
  const [placementBeds, setPlacementBeds] = useState<Bed[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [multiCreationMode, setMultiCreationMode] = useState(false);
  const [hasCollision, setHasCollision] = useState(false);

  const createBedGroup = useCallback((baseBed: Bed): Bed[] => {
    const beds: Bed[] = [];
    const timestamp = Date.now();
    if (!activePatchId) return [];
    
    for (let i = 0; i < bedConfig.quantity; i++) {
      const offsetY = i * (
        (baseBed.shape === 'rectangle' ? baseBed.dimensions.width || bedConfig.width : (baseBed.dimensions.radius || bedConfig.length) * 2) + 
        (bedConfig.spacing * 2)
      );
      
      const bedId = `bed-${timestamp}-${i}`;
      const bed: Bed = {
        id: bedId,
        patchId: activePatchId,
        shape: baseBed.shape,
        position: {
          x: baseBed.position.x,
          y: baseBed.position.y + offsetY
        },
        dimensions: baseBed.dimensions,
        rotation: 0,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      beds.push(bed);
    }

    return beds;
  }, [bedConfig, activePatchId]);

  const checkGroupCollision = useCallback((bedGroup: Bed[]): boolean => {
    for (const bed of bedGroup) {
      const footprint = calculateBedFootprint(bed, bedConfig.spacing);
      
      // Check against existing beds
      for (const existingBed of beds) {
        const existingFootprint = calculateBedFootprint(existingBed, bedConfig.spacing);
        if (checkCollision(footprint, existingFootprint)) {
          return true;
        }
      }
      
      // Check against other beds in the same group
      for (const otherBed of bedGroup) {
        if (bed.id !== otherBed.id) {
          const otherFootprint = calculateBedFootprint(otherBed, bedConfig.spacing);
          if (checkCollision(footprint, otherFootprint)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }, [beds, bedConfig.spacing]);

  const placeBed = useCallback((previewBed: Bed | null) => {
    if (!previewBed) return;

    const bedGroup = createBedGroup(previewBed);
    const collision = checkGroupCollision(bedGroup);
    
    setPlacementBeds(bedGroup);
    setHasCollision(collision);
    setShowConfirmation(true);
  }, [createBedGroup, checkGroupCollision]);

  const confirmPlacement = useCallback(() => {
    if (placementBeds.length === 0 || hasCollision) return false;

    // Add all beds in the group
    placementBeds.forEach((bed, index) => {
      addBed(bed);
      
      // Call auto-zoom callback for the first bed
      if (index === 0 && onBedCreated) {
        onBedCreated(bed.id);
      }
    });

    // Reset state
    setPlacementBeds([]);
    setShowConfirmation(false);
    setHasCollision(false);

    return !multiCreationMode; // Return true if should exit creation mode
  }, [placementBeds, hasCollision, addBed, onBedCreated, multiCreationMode]);

  const cancelPlacement = useCallback(() => {
    setPlacementBeds([]);
    setShowConfirmation(false);
    setHasCollision(false);
    return { resumePreview: false, bed: null };
  }, []);

  const clearPlacement = useCallback(() => {
    setPlacementBeds([]);
    setShowConfirmation(false);
    setMultiCreationMode(false);
    setHasCollision(false);
  }, []);

  return {
    placementBed: placementBeds[0] || null, // For backward compatibility
    placementBeds,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    hasCollision,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    clearPlacement
  };
};
