
import { Bed, BedConfig } from '../types/bed.types';
import { calculateBedFootprint, checkCollision } from './bedPositioning';

/**
 * Checks if any preview beds collide with existing beds or each other
 */
export const checkPreviewCollision = (
  previewBeds: Bed[], 
  existingBeds: Bed[], 
  spacing: number
): boolean => {
  for (const previewBed of previewBeds) {
    const footprint = calculateBedFootprint(previewBed, spacing);
    
    // Check against existing beds
    for (const existingBed of existingBeds) {
      const existingFootprint = calculateBedFootprint(existingBed, spacing);
      if (checkCollision(footprint, existingFootprint)) {
        return true;
      }
    }
    
    // Check against other preview beds
    for (const otherPreviewBed of previewBeds) {
      if (previewBed.id !== otherPreviewBed.id) {
        const otherFootprint = calculateBedFootprint(otherPreviewBed, spacing);
        if (checkCollision(footprint, otherFootprint)) {
          return true;
        }
      }
    }
  }
  
  return false;
};
