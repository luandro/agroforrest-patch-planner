
import { useState, useCallback } from 'react';
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

  const selectedPlacements = placements.filter(p => selectedPlacementIds.includes(p.id));

  const [editForm, setEditForm] = useState<PlantEditForm>(() => {
    const firstPlacement = selectedPlacements[0];
    return {
      maturity: 'seedling',
      spacing: 2.0,
      variety: 'Padrão',
      plantingDate: new Date().toISOString().split('T')[0],
      notes: firstPlacement?.notes || ''
    };
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Group selected plants by species
  const speciesGroups = selectedPlacements.reduce<Record<string, SpeciesGroup>>((acc, placement) => {
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
