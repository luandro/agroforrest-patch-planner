
import { useCallback } from 'react';
import { useCanvasFocusMode } from './useCanvasFocusMode';
import { usePlantSelection } from './usePlantSelection';
import { usePlantPlacement } from './usePlantPlacement';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useTimelineStore } from '../stores/timelineStore';
import { CanvasViewport } from '../types/canvas.types';
import type { Bed } from '../types/bed.types';
import type { PlantSpecies } from '../types/species.types';

interface UseFocusModeIntegrationProps {
  viewport: CanvasViewport;
  updateViewport: (updates: Partial<CanvasViewport>) => void;
  beds: Bed[];
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onOpenPlantSelection?: () => void;
  onOpenPlantSpeciesPanel?: () => void;
}

export const useFocusModeIntegration = ({
  viewport,
  updateViewport,
  beds,
  canvasRef,
  onOpenPlantSelection,
  onOpenPlantSpeciesPanel
}: UseFocusModeIntegrationProps) => {
  const { clearSelection: clearPlantSelection, selectedSpecies, setSelectedSpecies } = usePlantPlacementStore();
  const { setTimelineActive, resetTimeline } = useTimelineStore();

  // Focus mode management
  const {
    focusMode,
    isInFocusMode,
    focusedBedId,
    handleEnterFocus,
    handleExitFocus: originalExitFocus
  } = useCanvasFocusMode({
    viewport,
    updateViewport
  });

  // Enhanced exit focus that cleans up all related state
  const handleExitFocus = useCallback(() => {
    // Clear plant-related state
    clearPlantSelection();
    setSelectedSpecies(null);
    
    // Close timeline if active
    setTimelineActive(false);
    resetTimeline();
    
    // Exit focus mode
    originalExitFocus();
    
    console.log('Exited focus mode - all state cleared');
  }, [clearPlantSelection, setSelectedSpecies, setTimelineActive, resetTimeline, originalExitFocus]);

  // Get focused bed
  const focusedBed = focusedBedId ? beds.find(b => b.id === focusedBedId) || null : null;

  // Plant selection management
  const plantSelection = usePlantSelection({
    focusedBed,
    viewport,
    canvasRef,
    onOpenPlantSpeciesPanel
  });

  // Plant placement management
  const plantPlacement = usePlantPlacement({
    viewport,
    focusedBed,
    canvasRef
  });

  // Handle plant selection opening
  const handlePlantSelectionOpen = useCallback(() => {
    if (onOpenPlantSelection) {
      onOpenPlantSelection();
    }
  }, [onOpenPlantSelection]);

  // Handle species selection for placement
  const handlePlantSpeciesSelect = useCallback((species: PlantSpecies) => {
    plantPlacement.selectSpeciesForPlacement(species);
  }, [plantPlacement]);

  return {
    // Focus mode
    focusMode,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    handleEnterFocus,
    handleExitFocus,
    
    // Plant operations
    ...plantSelection,
    ...plantPlacement,
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect
  };
};
