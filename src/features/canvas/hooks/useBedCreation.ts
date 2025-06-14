
import { CanvasViewport } from '../types/canvas.types';
import { useBedCreationOrchestrator } from './useBedCreationOrchestrator';

interface UseBedCreationProps {
  viewport: CanvasViewport;
  gridSize?: number;
  onBedCreated?: (bedId: string) => void;
}

/**
 * Main bed creation hook that orchestrates the entire bed creation flow.
 * This hook provides a clean API for bed creation with preview, placement, and confirmation.
 */
export const useBedCreation = (props: UseBedCreationProps) => {
  return useBedCreationOrchestrator(props);
};
