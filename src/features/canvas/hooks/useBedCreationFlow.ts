
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
  // No modification needed here, but ensure the orchestration passes live preview state.
  return useBedCreation({
    viewport,
    gridSize,
    onBedCreated: (bedId) => {
      setTimeout(() => {
        // See orchestration and wiring.
      }, 100);
      onBedCreated?.(bedId);
    },
  });
};
