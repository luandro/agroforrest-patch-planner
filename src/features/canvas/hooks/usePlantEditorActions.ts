
import { useCallback, useMemo } from 'react';
import { usePlantPlacementStore, PlantPlacement } from '../stores/plantPlacementStore';
import { PlantSpecies } from '../types/species.types';

interface SpeciesGroup {
  species: PlantSpecies;
  count: number;
  placements: PlantPlacement[];
}

interface UsePlantEditorActionsProps {
  selectedPlacementIds: string[];
  onClose: () => void;
}

interface UsePlantEditorActionsReturn {
  // Data
  selectedPlacements: PlantPlacement[];
  speciesGroups: Record<string, SpeciesGroup>;
  selectedCount: number;
  isSingleSelection: boolean;
  singlePlacement: PlantPlacement | null;

  // Actions
  handleDelete: () => void;
  handleDuplicate: () => void;
  handleEdit: () => void;
  handleMove: () => void;
  handleSelectSameSpecies: () => void;
  handleAdjustSpacing: () => void;
  removePlacements: (ids: string[]) => void;

  // Labels
  getDeleteLabel: () => string;
  getSelectionLabel: () => string;
}

/**
 * Shared hook for plant editor actions used by both Desktop and Mobile editors.
 * Extracts common business logic for plant selection management.
 */
export function usePlantEditorActions({
  selectedPlacementIds,
  onClose
}: UsePlantEditorActionsProps): UsePlantEditorActionsReturn {
  const { placements, removePlacements } = usePlantPlacementStore();

  // Filter selected placements
  const selectedPlacements = useMemo(() => {
    return placements.filter(p => selectedPlacementIds.includes(p.id));
  }, [placements, selectedPlacementIds]);

  // Calculate species groups for display
  const speciesGroups = useMemo(() => {
    return selectedPlacements.reduce<Record<string, SpeciesGroup>>((acc, placement) => {
      const speciesId = placement.species.id;
      if (!acc[speciesId]) {
        acc[speciesId] = {
          species: placement.species,
          count: 0,
          placements: []
        };
      }
      acc[speciesId].count++;
      acc[speciesId].placements.push(placement);
      return acc;
    }, {});
  }, [selectedPlacements]);

  // Computed values
  const selectedCount = selectedPlacementIds.length;
  const isSingleSelection = selectedCount === 1;
  const singlePlacement = isSingleSelection ? selectedPlacements[0] : null;

  // Action handlers
  const handleDelete = useCallback(() => {
    removePlacements(selectedPlacementIds);
    onClose();
  }, [removePlacements, selectedPlacementIds, onClose]);

  const handleDuplicate = useCallback(() => {
    // TODO: Implement duplication logic
    // This would duplicate the selected placements with slight position offsets
    console.log('Duplicate plants:', selectedPlacementIds);
  }, [selectedPlacementIds]);

  const handleEdit = useCallback(() => {
    // TODO: Open detailed editing panel
    console.log('Edit plants:', selectedPlacementIds);
  }, [selectedPlacementIds]);

  const handleMove = useCallback(() => {
    // TODO: Implement move to different bed
    console.log('Move plants:', selectedPlacementIds);
  }, [selectedPlacementIds]);

  const handleSelectSameSpecies = useCallback(() => {
    // TODO: Select all plants of the same species in the bed
    console.log('Select same species');
  }, []);

  const handleAdjustSpacing = useCallback(() => {
    // TODO: Adjust spacing between selected plants
    console.log('Adjust spacing');
  }, []);

  // Label generators
  const getDeleteLabel = useCallback(() => {
    return selectedCount > 1
      ? `Deletar ${selectedCount} Plantas`
      : 'Deletar Planta';
  }, [selectedCount]);

  const getSelectionLabel = useCallback(() => {
    return `${selectedCount} planta${selectedCount > 1 ? 's' : ''} selecionada${selectedCount > 1 ? 's' : ''}`;
  }, [selectedCount]);

  return {
    // Data
    selectedPlacements,
    speciesGroups,
    selectedCount,
    isSingleSelection,
    singlePlacement,

    // Actions
    handleDelete,
    handleDuplicate,
    handleEdit,
    handleMove,
    handleSelectSameSpecies,
    handleAdjustSpacing,
    removePlacements,

    // Labels
    getDeleteLabel,
    getSelectionLabel
  };
}
