
import { useCallback } from 'react';
import { useCanvasFocusMode } from './useCanvasFocusMode';
import { usePlantSelectionFlow } from './usePlantSelectionFlow';
import { CanvasViewport } from '../types/canvas.types';

interface UseFocusModeIntegrationProps {
  viewport: CanvasViewport;
  updateViewport: (updates: Partial<CanvasViewport>) => void;
  beds: any[];
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onOpenPlantSelection?: () => void;
}

export const useFocusModeIntegration = ({
  viewport,
  updateViewport,
  beds,
  canvasRef,
  onOpenPlantSelection
}: UseFocusModeIntegrationProps) => {
  // Focus mode management
  const { 
    focusMode, 
    isInFocusMode, 
    focusedBedId, 
    handleEnterFocus, 
    handleExitFocus 
  } = useCanvasFocusMode({
    viewport,
    updateViewport
  });

  // Get the focused bed directly from the beds array using the focused bed ID
  const focusedBed = focusedBedId ? beds.find(bed => bed.id === focusedBedId) : null;

  // Plant selection flow
  const {
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect,
    cancelPlantPlacement
  } = usePlantSelectionFlow({
    viewport,
    focusedBed,
    canvasRef,
    onOpenPlantSelection
  });

  // Enhanced exit focus that also cancels plant placement
  const handleExitFocusEnhanced = useCallback(() => {
    handleExitFocus();
    cancelPlantPlacement();
  }, [handleExitFocus, cancelPlantPlacement]);

  return {
    // Focus mode state
    focusMode,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    
    // Focus mode actions
    handleEnterFocus,
    handleExitFocus: handleExitFocusEnhanced,
    
    // Plant selection
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect,
    cancelPlantPlacement
  };
};
