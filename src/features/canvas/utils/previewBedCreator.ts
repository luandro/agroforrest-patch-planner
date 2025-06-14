
import { Bed, BedConfig } from '../types/bed.types';

/**
 * Creates a group of preview beds based on the base bed configuration
 */
export const createPreviewBedGroup = (baseBed: Bed, bedConfig: BedConfig): Bed[] => {
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
};

/**
 * Creates a base preview bed from configuration
 */
export const createBaseBed = (
  position: { x: number; y: number },
  bedConfig: BedConfig,
  timestamp: number = Date.now()
): Bed => {
  return {
    id: `preview-${timestamp}`,
    shape: bedConfig.shape,
    position,
    dimensions: bedConfig.shape === 'rectangle' 
      ? { length: bedConfig.length, width: bedConfig.width }
      : { radius: bedConfig.length },
    rotation: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};
