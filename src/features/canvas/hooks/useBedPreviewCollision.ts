
import { useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { calculateBedFootprint, checkCollision } from '../utils/bedPositioning';
import { useBedStore } from '../stores/bedStore';

interface UseBedPreviewCollisionProps {
  bedConfig: BedConfig;
}

export const useBedPreviewCollision = ({ bedConfig }: UseBedPreviewCollisionProps) => {
  const { beds } = useBedStore();

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

  return {
    checkPreviewCollision
  };
};
