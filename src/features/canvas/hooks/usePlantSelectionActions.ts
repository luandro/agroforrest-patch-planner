
import { useCallback } from 'react';
import { Bed } from '../types/bed.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

interface UsePlantSelectionActionsProps {
  focusedBed: Bed | null;
}

export const usePlantSelectionActions = ({
  focusedBed
}: UsePlantSelectionActionsProps) => {
  const {
    selectedPlacementIds,
    selectPlacements,
    clearSelection,
    getPlacementsForBed
  } = usePlantPlacementStore();

  // Enhanced plant selection with better multi-select support
  const handlePlantSelection = useCallback((plant: any, isMultiSelect: boolean = false) => {
    if (plant) {
      if (isMultiSelect) {
        // Multi-select toggle with improved logic
        const newSelection = selectedPlacementIds.includes(plant.id)
          ? selectedPlacementIds.filter(id => id !== plant.id)
          : [...selectedPlacementIds, plant.id];
        selectPlacements(newSelection);
      } else {
        // Single select with toggle behavior
        if (selectedPlacementIds.length === 1 && selectedPlacementIds[0] === plant.id) {
          // Deselect if clicking the only selected plant
          clearSelection();
        } else {
          selectPlacements([plant.id]);
        }
      }
      return true; // Plant was selected
    } else {
      // Clicked empty space
      if (!isMultiSelect) {
        clearSelection();
      }
      return false; // No plant selected
    }
  }, [selectedPlacementIds, selectPlacements, clearSelection]);

  // Select all plants of same species with visual feedback
  const selectSameSpecies = useCallback(() => {
    if (!focusedBed || selectedPlacementIds.length === 0) return;

    const placements = getPlacementsForBed(focusedBed.id);
    const selectedPlacement = placements.find(p => p.id === selectedPlacementIds[0]);
    
    if (selectedPlacement) {
      const sameSpeciesIds = placements
        .filter(p => p.species.id === selectedPlacement.species.id)
        .map(p => p.id);
      selectPlacements(sameSpeciesIds);
    }
  }, [focusedBed, selectedPlacementIds, getPlacementsForBed, selectPlacements]);

  // Select all plants in bed
  const selectAll = useCallback(() => {
    if (!focusedBed) return;
    
    const placements = getPlacementsForBed(focusedBed.id);
    const allIds = placements.map(p => p.id);
    selectPlacements(allIds);
  }, [focusedBed, getPlacementsForBed, selectPlacements]);

  // Invert current selection
  const invertSelection = useCallback(() => {
    if (!focusedBed) return;
    
    const placements = getPlacementsForBed(focusedBed.id);
    const allIds = placements.map(p => p.id);
    const invertedIds = allIds.filter(id => !selectedPlacementIds.includes(id));
    selectPlacements(invertedIds);
  }, [focusedBed, getPlacementsForBed, selectedPlacementIds, selectPlacements]);

  return {
    selectedPlacementIds,
    handlePlantSelection,
    selectSameSpecies,
    selectAll,
    invertSelection,
    clearSelection
  };
};
