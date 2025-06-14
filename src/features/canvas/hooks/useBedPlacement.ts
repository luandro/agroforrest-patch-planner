
import { useState, useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { useBedStore } from '../stores/bedStore';

interface UseBedPlacementProps {
  bedConfig: BedConfig;
  onBedCreated?: (bedId: string) => void;
}

export const useBedPlacement = ({ bedConfig, onBedCreated }: UseBedPlacementProps) => {
  const { addBed } = useBedStore();
  const [placementBed, setPlacementBed] = useState<Bed | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [multiCreationMode, setMultiCreationMode] = useState(false);

  const placeBed = useCallback((previewBed: Bed | null) => {
    if (!previewBed) return;

    // Move from preview to placement
    setPlacementBed(previewBed);
    setShowConfirmation(true);
  }, []);

  const confirmPlacement = useCallback(() => {
    if (!placementBed) return;

    // Create final bed(s) based on configuration
    const beds: Bed[] = [];
    
    for (let i = 0; i < bedConfig.quantity; i++) {
      const offsetY = i * (bedConfig.spacing + (placementBed.dimensions.width || bedConfig.width));
      
      const bedId = `bed-${Date.now()}-${i}`;
      const bed: Bed = {
        id: bedId,
        shape: placementBed.shape,
        position: {
          x: placementBed.position.x,
          y: placementBed.position.y + offsetY
        },
        dimensions: placementBed.dimensions,
        rotation: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      beds.push(bed);
      addBed(bed);
      
      // Call auto-zoom callback for the first bed
      if (i === 0 && onBedCreated) {
        onBedCreated(bedId);
      }
    }

    // Reset state
    setPlacementBed(null);
    setShowConfirmation(false);

    return !multiCreationMode; // Return true if should exit creation mode
  }, [placementBed, bedConfig, addBed, onBedCreated, multiCreationMode]);

  const cancelPlacement = useCallback((cursorPosition: { x: number; y: number } | null) => {
    if (placementBed && cursorPosition) {
      // Resume preview at cursor position - this will be handled by the main hook
      setPlacementBed(null);
      setShowConfirmation(false);
      return { resumePreview: true, bed: placementBed };
    } else {
      // Cancel completely
      setPlacementBed(null);
      setShowConfirmation(false);
      return { resumePreview: false, bed: null };
    }
  }, [placementBed]);

  const clearPlacement = useCallback(() => {
    setPlacementBed(null);
    setShowConfirmation(false);
    setMultiCreationMode(false);
  }, []);

  return {
    placementBed,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    clearPlacement
  };
};
