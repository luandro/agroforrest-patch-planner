
import { useCallback } from 'react';
import { Bed, BedConfig } from '../types/bed.types';
import { usePatchStore } from '../stores/patchStore';

interface UseBedPreviewCreationProps {
  bedConfig: BedConfig;
}

export const useBedPreviewCreation = ({ bedConfig }: UseBedPreviewCreationProps) => {
  const { activePatchId } = usePatchStore();

  const createPreviewBedGroup = useCallback((baseBed: Bed): Bed[] => {
    const beds: Bed[] = [];
    if (!activePatchId) return beds;
    
    for (let i = 0; i < bedConfig.quantity; i++) {
      // Calculate offset for parallel placement
      const offsetY = i * (
        (baseBed.shape === 'rectangle' ? baseBed.dimensions.width || bedConfig.width : (baseBed.dimensions.radius || bedConfig.length) * 2) + 
        (bedConfig.spacing * 2)
      );
      
      const bed: Bed = {
        id: `preview-${Date.now()}-${i}`,
        patchId: activePatchId,
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
  }, [bedConfig, activePatchId]);

  const createBaseBed = useCallback((position: { x: number; y: number }, shape: 'rectangle' | 'circle'): Bed => {
    const patchId = activePatchId || 'preview-patch';
    return {
      id: `preview-${Date.now()}`,
      patchId,
      shape,
      position,
      dimensions: shape === 'rectangle' 
        ? { length: bedConfig.length, width: bedConfig.width }
        : { radius: bedConfig.length },
      rotation: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }, [bedConfig, activePatchId]);

  return {
    createPreviewBedGroup,
    createBaseBed
  };
};
