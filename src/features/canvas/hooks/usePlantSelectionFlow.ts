
import { useCallback } from 'react';
import { usePlantPlacement } from './usePlantPlacement';
import { PlantSpecies } from '../types/species.types';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

interface UsePlantSelectionFlowProps {
  viewport: CanvasViewport;
  focusedBed: Bed | null;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onOpenPlantSelection?: () => void;
}

export const usePlantSelectionFlow = ({
  viewport,
  focusedBed,
  canvasRef,
  onOpenPlantSelection
}: UsePlantSelectionFlowProps) => {
  const {
    selectSpeciesForPlacement,
    cancelPlacement: cancelPlantPlacement
  } = usePlantPlacement({
    viewport,
    focusedBed,
    canvasRef
  });

  const handlePlantSelectionOpen = useCallback(() => {
    if (onOpenPlantSelection) {
      onOpenPlantSelection();
    }
  }, [onOpenPlantSelection]);

  const handlePlantSpeciesSelect = useCallback((species: PlantSpecies) => {
    selectSpeciesForPlacement(species);
  }, [selectSpeciesForPlacement]);

  return {
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect,
    cancelPlantPlacement
  };
};
