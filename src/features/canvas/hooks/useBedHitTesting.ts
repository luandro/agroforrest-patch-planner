
import { useCallback } from 'react';
import { Bed } from '../types/bed.types';
import { useBedStore } from '../stores/bedStore';

export const useBedHitTesting = () => {
  const { beds } = useBedStore();

  // Check if a point is inside a bed
  const isPointInBed = useCallback((x: number, y: number, bed: Bed): boolean => {
    const dx = x - bed.position.x;
    const dy = y - bed.position.y;

    if (bed.shape === 'circle') {
      const radius = bed.dimensions.radius || 0;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    } else {
      const length = bed.dimensions.length || 0;
      const width = bed.dimensions.width || 0;
      return Math.abs(dx) <= length / 2 && Math.abs(dy) <= width / 2;
    }
  }, []);

  // Find bed at world coordinates
  const getBedAtWorldPoint = useCallback((worldX: number, worldY: number): Bed | null => {
    // Check beds in reverse order (top to bottom in visual stack)
    for (let i = beds.length - 1; i >= 0; i--) {
      const bed = beds[i];
      if (isPointInBed(worldX, worldY, bed)) {
        return bed;
      }
    }
    
    return null;
  }, [beds, isPointInBed]);

  // Find beds in a rectangular area
  const getBedsInArea = useCallback((minX: number, maxX: number, minY: number, maxY: number): string[] => {
    return beds
      .filter(bed => 
        bed.position.x >= minX && bed.position.x <= maxX &&
        bed.position.y >= minY && bed.position.y <= maxY
      )
      .map(bed => bed.id);
  }, [beds]);

  return {
    getBedAtWorldPoint,
    getBedsInArea
  };
};
