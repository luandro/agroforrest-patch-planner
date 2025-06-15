
import { useCallback } from 'react';
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { usePlantHitTesting } from './usePlantHitTesting';
import { usePlantAreaSelection } from './usePlantAreaSelection';
import { usePlantSelectionActions } from './usePlantSelectionActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface UsePlantSelectionProps {
  focusedBed: Bed | null;
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onOpenPlantSpeciesPanel?: () => void;
}

export const usePlantSelection = ({
  focusedBed,
  viewport,
  canvasRef,
  onOpenPlantSpeciesPanel
}: UsePlantSelectionProps) => {
  const isMobile = useIsMobile();

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

  // Enhanced plant selection with mobile species panel trigger
  const handlePlantSelection = useCallback((canvasX: number, canvasY: number, isMultiSelect: boolean = false) => {
    const plant = getPlantAtCanvasPosition(canvasX, canvasY);
    
    // On mobile, if user taps a plant and it's the only selection, open species panel
    if (isMobile && plant && !isMultiSelect && selectedPlacementIds.length <= 1) {
      const wasSelected = handlePlantSelectionAction(plant, isMultiSelect);
      
      // If the plant was just selected and it's the only one, open species panel
      if (wasSelected && onOpenPlantSpeciesPanel) {
        // Small delay to ensure selection state is updated
        setTimeout(() => {
          onOpenPlantSpeciesPanel();
        }, 100);
      }
      
      return wasSelected;
    }
    
    return handlePlantSelectionAction(plant, isMultiSelect);
  }, [getPlantAtCanvasPosition, handlePlantSelectionAction, isMobile, selectedPlacementIds.length, onOpenPlantSpeciesPanel]);

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
