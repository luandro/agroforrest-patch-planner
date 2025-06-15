
import { useCallback } from 'react';
import { Bed } from '../types/bed.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { usePlantCoordinateTransforms } from './usePlantCoordinateTransforms';
import { CanvasViewport } from '../types/canvas.types';

interface UsePlantHitTestingProps {
  focusedBed: Bed | null;
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const usePlantHitTesting = ({
  focusedBed,
  viewport,
  canvasRef
}: UsePlantHitTestingProps) => {
  const { getPlacementsForBed } = usePlantPlacementStore();
  const { canvasToBedCoordinates } = usePlantCoordinateTransforms({
    focusedBed,
    viewport,
    canvasRef
  });

  // Find plant at canvas position with improved tolerance
  const getPlantAtCanvasPosition = useCallback((canvasX: number, canvasY: number) => {
    if (!focusedBed) return null;

    const bedPos = canvasToBedCoordinates(canvasX, canvasY);
    if (!bedPos) return null;

    const placements = getPlacementsForBed(focusedBed.id);
    const tolerance = 0.2; // Increased tolerance for better touch interaction

    return placements.find(placement =>
      Math.abs(placement.position.x - bedPos.x) < tolerance &&
      Math.abs(placement.position.y - bedPos.y) < tolerance
    ) || null;
  }, [focusedBed, canvasToBedCoordinates, getPlacementsForBed]);

  return {
    getPlantAtCanvasPosition
  };
};
