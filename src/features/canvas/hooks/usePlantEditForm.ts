
import { useState, useCallback, useMemo, useEffect } from 'react';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import type { PlantPlacement } from '../stores/plantPlacementStore';
import { PlantSpecies } from '../types/species.types';

export interface PlantEditForm {
  maturity: 'seed' | 'seedling' | 'young' | 'adult';
  spacing: number;
  variety: string;
  plantingDate: string;
  notes: string;
}

export interface SpeciesGroup {
  species: PlantSpecies;
  count: number;
  placements: PlantPlacement[];
}

interface UsePlantEditFormProps {
  selectedPlacementIds: string[];
}

export function usePlantEditForm({ selectedPlacementIds }: UsePlantEditFormProps) {
  const { placements, updatePlacement } = usePlantPlacementStore();

  // Memoize selected placements to avoid recalculating on every render
  const selectedPlacements = useMemo(() =>
    placements.filter(p => selectedPlacementIds.includes(p.id)),
    [placements, selectedPlacementIds]
  );

  const [editForm, setEditForm] = useState<PlantEditForm>({
    maturity: 'seedling',
    spacing: 2.0,
    variety: 'Padrão',
    plantingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync notes from first selected placement when selection changes
  useEffect(() => {
    const firstPlacement = selectedPlacements[0];
    if (firstPlacement) {
      setEditForm(prev => ({
        ...prev,
        notes: firstPlacement.notes || ''
      }));
      setHasUnsavedChanges(false);
    }
  }, [selectedPlacements]);

  // Memoize species groups calculation
  const speciesGroups = useMemo(() =>
    selectedPlacements.reduce<Record<string, SpeciesGroup>>((acc, placement) => {
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
    }, {}),
    [selectedPlacements]
  );

  const handleFormChange = useCallback(<K extends keyof PlantEditForm>(field: K, value: PlantEditForm[K]) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const handleApplyChanges = useCallback(() => {
    selectedPlacementIds.forEach(placementId => {
      updatePlacement(placementId, {
        notes: editForm.notes
        // Add other fields as they're implemented in the placement store
      });
    });
    setHasUnsavedChanges(false);
  }, [selectedPlacementIds, editForm, updatePlacement]);

  return {
    editForm,
    hasUnsavedChanges,
    selectedPlacements,
    speciesGroups,
    handleFormChange,
    handleApplyChanges
  };
}

/**
 * Get badge color based on plant category
 */
export function getCategoryBadgeColor(category: string): string {
  switch (category) {
    case 'trees': return 'bg-green-700 text-white';
    case 'shrubs': return 'bg-green-500 text-white';
    case 'ground-cover': return 'bg-green-300 text-green-800';
    case 'herbs': return 'bg-green-200 text-green-800';
    default: return 'bg-gray-200 text-gray-800';
  }
}
