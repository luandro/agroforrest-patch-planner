
import { useCallback, useState } from 'react';
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { usePlantCoordinateTransforms } from './usePlantCoordinateTransforms';

interface UsePlantAreaSelectionProps {
  focusedBed: Bed | null;
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const usePlantAreaSelection = ({
  focusedBed,
  viewport,
  canvasRef
}: UsePlantAreaSelectionProps) => {
  const { getPlacementsForBed, selectPlacements } = usePlantPlacementStore();
  const { canvasToBedCoordinates } = usePlantCoordinateTransforms({
    focusedBed,
    viewport,
    canvasRef
  });

  const [isAreaSelecting, setIsAreaSelecting] = useState(false);
  const [selectionArea, setSelectionArea] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  // Start area selection with visual feedback
  const startAreaSelection = useCallback((canvasX: number, canvasY: number) => {
    setIsAreaSelecting(true);
    setSelectionArea({
      startX: canvasX,
      startY: canvasY,
      endX: canvasX,
      endY: canvasY
    });
  }, []);

  // Update area selection
  const updateAreaSelection = useCallback((canvasX: number, canvasY: number) => {
    if (isAreaSelecting && selectionArea) {
      setSelectionArea({
        ...selectionArea,
        endX: canvasX,
        endY: canvasY
      });
    }
  }, [isAreaSelecting, selectionArea]);

  // Finish area selection with improved selection logic
  const finishAreaSelection = useCallback(() => {
    if (!isAreaSelecting || !selectionArea || !focusedBed) {
      setIsAreaSelecting(false);
      setSelectionArea(null);
      return;
    }

    const placements = getPlacementsForBed(focusedBed.id);
    const selectedIds: string[] = [];

    // Convert selection area to bed coordinates
    const startBedPos = canvasToBedCoordinates(selectionArea.startX, selectionArea.startY);
    const endBedPos = canvasToBedCoordinates(selectionArea.endX, selectionArea.endY);

    if (startBedPos && endBedPos) {
      const minX = Math.min(startBedPos.x, endBedPos.x);
      const maxX = Math.max(startBedPos.x, endBedPos.x);
      const minY = Math.min(startBedPos.y, endBedPos.y);
      const maxY = Math.max(startBedPos.y, endBedPos.y);

      placements.forEach(placement => {
        if (placement.position.x >= minX && placement.position.x <= maxX &&
            placement.position.y >= minY && placement.position.y <= maxY) {
          selectedIds.push(placement.id);
        }
      });
    }

    selectPlacements(selectedIds);
    setIsAreaSelecting(false);
    setSelectionArea(null);
  }, [isAreaSelecting, selectionArea, focusedBed, getPlacementsForBed, canvasToBedCoordinates, selectPlacements]);

  return {
    isAreaSelecting,
    selectionArea,
    startAreaSelection,
    updateAreaSelection,
    finishAreaSelection
  };
};
