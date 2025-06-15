
import { useCallback, useEffect } from 'react';
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { PlantSpecies } from '../types/species.types';
import {
  calculateBulkPlacement,
  getDefaultBulkConfig
} from '../utils/bulkPlacementCalculator';
import { BulkPlacementConfig } from '../types/bulkPlacement.types';

export const useBulkPlacement = () => {
  const {
    isActive,
    selectedSpecies,
    selectedBed,
    config,
    preview,
    showPreview,
    isCalculating,
    setActive,
    setSelectedSpecies,
    setSelectedBed,
    setConfig,
    updateConfig: storeUpdateConfig,
    setPreview,
    setShowPreview,
    setIsCalculating,
    reset,
  } = useBulkPlacementStore();

  const { addPlacement, getPlacementsForBed } = usePlantPlacementStore();
  const { beds, focusMode } = useBedStore();

  // Get current focused bed
  const focusedBed = focusMode.isActive && focusMode.bedId
    ? beds.find(b => b.id === focusMode.bedId) || null
    : null;

  // Initialize bulk placement for a species
  const initializeBulkPlacement = useCallback((species: PlantSpecies) => {
    if (!focusedBed) {
      console.warn('No focused bed for bulk placement');
      return;
    }

    const defaultConfig = getDefaultBulkConfig(species);

    setSelectedSpecies(species);
    setSelectedBed(focusedBed);
    setConfig(defaultConfig);
    setActive(true);
  }, [focusedBed, setActive, setConfig, setSelectedBed, setSelectedSpecies]);

  // Calculate preview
  const calculatePreview = useCallback(async () => {
    if (!selectedSpecies || !selectedBed || !config) {
      setPreview(null);
      return;
    }

    setIsCalculating(true);

    try {
      // Get existing placements for the bed
      const existingPlacements = getPlacementsForBed(selectedBed.id);

      // Calculate bulk placement
      const previewResult = calculateBulkPlacement(
        selectedBed,
        selectedSpecies,
        config,
        existingPlacements
      );

      setPreview(previewResult);
    } catch (error) {
      console.error('Error calculating bulk placement:', error);
      setPreview(null);
    } finally {
      setIsCalculating(false);
    }
  }, [selectedSpecies, selectedBed, config, getPlacementsForBed, setIsCalculating, setPreview]);

  // Update config and let useEffect trigger recalculation
  const updateConfig = useCallback((updates: Partial<BulkPlacementConfig>) => {
    storeUpdateConfig(updates);
  }, [storeUpdateConfig]);

  // Execute bulk placement
  const executeBulkPlacement = useCallback(() => {
    if (!selectedSpecies || !selectedBed || !preview || preview.positions.length === 0) {
      console.warn('Cannot execute bulk placement: missing data');
      return false;
    }

    // Add all plants
    preview.positions.forEach(position => {
      addPlacement({
        bedId: selectedBed.id,
        species: selectedSpecies,
        position: { x: position.x, y: position.y }
      });
    });

    // Reset bulk placement state
    reset();
    setActive(false);

    return true;
  }, [selectedSpecies, selectedBed, preview, addPlacement, reset, setActive]);

  // Cancel bulk placement
  const cancelBulkPlacement = useCallback(() => {
    setShowPreview(false);
    setActive(false);
  }, [setActive, setShowPreview]);

  // Auto-calculate preview when config changes
  useEffect(() => {
    if (isActive && config) {
      calculatePreview();
    }
  }, [isActive, config, calculatePreview]);

  return {
    // State
    isActive,
    selectedSpecies,
    selectedBed,
    config,
    preview,
    showPreview,
    isCalculating,

    // Actions
    initializeBulkPlacement,
    updateConfig,
    calculatePreview,
    executeBulkPlacement,
    cancelBulkPlacement,
    setShowPreview,

    // Computed
    canExecute: preview && preview.positions.length > 0,
    hasConflicts: preview && preview.conflicts > 0
  };
};
