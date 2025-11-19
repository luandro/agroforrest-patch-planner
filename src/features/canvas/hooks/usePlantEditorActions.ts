
import { useCallback, useMemo } from 'react';
import { usePlantPlacementStore, PlantPlacement } from '../stores/plantPlacementStore';
import { usePatchStore } from '../stores/patchStore';
import { PlantSpecies } from '../types/species.types';
import { storeLogger } from '@/lib/logger';
import { PLANT } from '../config';

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
  const { placements, removePlacements, selectPlacements, getPlacementsForBed } = usePlantPlacementStore();

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
    // Duplicate selected placements with slight position offsets
    // Batch all duplicates as a single history entry
    const { currentPatchId } = usePatchStore.getState();
    const store = usePlantPlacementStore.getState();

    const newPlacements: PlantPlacement[] = selectedPlacements.map((placement, index) => {
      // Create staggered offset for multiple duplicates
      const xOffset = PLANT.DUPLICATE_OFFSET * (1 + (index % 3));
      const yOffset = PLANT.DUPLICATE_OFFSET * (1 + Math.floor(index / 3));

      return {
        id: `plant-${Date.now()}-${Math.random()}-${index}`,
        bedId: placement.bedId,
        patchId: currentPatchId || placement.patchId,
        species: placement.species,
        position: {
          x: placement.position.x + xOffset,
          y: placement.position.y + yOffset
        },
        notes: placement.notes
      };
    });

    // Batch update: add all placements at once, then add single history entry
    usePlantPlacementStore.setState(state => ({
      placements: [...state.placements, ...newPlacements],
      isDirty: true
    }));
    store.addToHistory();

    storeLogger.info(`Duplicated ${selectedPlacements.length} plant(s)`);
  }, [selectedPlacements]);

  const handleEdit = useCallback(() => {
    // Note: Detailed editing is handled by the parent component
    // This callback can be used to trigger UI state changes
    storeLogger.debug('Edit requested for plants:', selectedPlacementIds);
  }, [selectedPlacementIds]);

  const handleMove = useCallback(() => {
    // Note: Moving to a different bed requires bed selection UI
    // This is tracked as a future enhancement
    storeLogger.debug('Move requested for plants:', selectedPlacementIds);
  }, [selectedPlacementIds]);

  const handleSelectSameSpecies = useCallback(() => {
    // Get the species IDs from selected placements
    const selectedSpeciesIds = new Set(
      selectedPlacements.map(p => p.species.id)
    );

    // Get the bed IDs from selected placements
    const selectedBedIds = new Set(
      selectedPlacements.map(p => p.bedId)
    );

    // Find all placements in the same beds with matching species
    const matchingIds: string[] = [];
    selectedBedIds.forEach(bedId => {
      const bedPlacements = getPlacementsForBed(bedId);
      bedPlacements.forEach(placement => {
        if (selectedSpeciesIds.has(placement.species.id)) {
          matchingIds.push(placement.id);
        }
      });
    });

    // Select all matching placements
    selectPlacements(matchingIds);
    storeLogger.info(`Selected ${matchingIds.length} plant(s) of same species`);
  }, [selectedPlacements, getPlacementsForBed, selectPlacements]);

  const handleAdjustSpacing = useCallback(() => {
    // Note: Spacing adjustment requires a spacing input UI
    // This is tracked as a future enhancement
    storeLogger.debug('Adjust spacing requested for plants:', selectedPlacementIds);
  }, [selectedPlacementIds]);

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
