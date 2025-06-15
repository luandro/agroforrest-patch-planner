
import { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { useBedCreation } from './useBedCreation';

interface UseBedCreationFlowProps {
  viewport: CanvasViewport;
  gridSize: number;
  onBedCreated?: (bedId: string) => void;
}

export const useBedCreationFlow = ({ 
  viewport, 
  gridSize, 
  onBedCreated 
}: UseBedCreationFlowProps) => {
  return useBedCreation({
    viewport,
    gridSize,
    onBedCreated: (bedId) => {
      setTimeout(() => {
        // centerOnBed is a placeholder in useCanvasViewport and doesn't have access to beds.
        // This functionality can be enhanced in a future step.
        // centerOnBed(bedId, 2.0);
      }, 100);
      onBedCreated?.(bedId);
    },
  });
};
