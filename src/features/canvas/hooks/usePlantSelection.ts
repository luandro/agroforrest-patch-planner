
import { useCallback } from 'react';
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { usePlantHitTesting } from './usePlantHitTesting';
import { usePlantAreaSelection } from './usePlantAreaSelection';
import { usePlantSelectionActions } from './usePlantSelectionActions';

interface UsePlantSelectionProps {
  focusedBed: Bed | null;
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const usePlantSelection = ({
  focusedBed,
  viewport,
  canvasRef
}: UsePlantSelectionProps) => {
  // Plant hit testing
  const { getPlantAtCanvasPosition } = usePlantHitTesting({
    focusedBed,
    viewport,
    canvasRef
  });

  // Area selection functionality
  const {
    isAreaSelecting,
    selectionArea,
    startAreaSelection,
    updateAreaSelection,
    finishAreaSelection
  } = usePlantAreaSelection({
    focusedBed,
    viewport,
    canvasRef
  });

  // Selection actions
  const {
    selectedPlacementIds,
    handlePlantSelection: handlePlantSelectionAction,
    selectSameSpecies,
    selectAll,
    invertSelection,
    clearSelection
  } = usePlantSelectionActions({
    focusedBed
  });

  // Enhanced plant selection with canvas coordinate handling
  const handlePlantSelection = useCallback((canvasX: number, canvasY: number, isMultiSelect: boolean = false) => {
    const plant = getPlantAtCanvasPosition(canvasX, canvasY);
    return handlePlantSelectionAction(plant, isMultiSelect);
  }, [getPlantAtCanvasPosition, handlePlantSelectionAction]);

  return {
    selectedPlacementIds,
    isAreaSelecting,
    selectionArea,
    handlePlantSelection,
    startAreaSelection,
    updateAreaSelection,
    finishAreaSelection,
    selectSameSpecies,
    selectAll,
    invertSelection,
    clearSelection,
    getPlantAtCanvasPosition
  };
};
