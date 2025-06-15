
import { useCallback } from 'react';
import { usePlantPlacement } from './usePlantPlacement';
import { PlantSpecies } from '../types/species.types';

interface UsePlantSelectionFlowProps {
  viewport: any;
  focusedBed: any;
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
