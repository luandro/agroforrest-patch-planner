
import { useCallback, useEffect } from 'react';
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { calculateBulkPlacement } from '../utils/bulkPlacementCalculator';

export const useBulkPlacement = () => {
  const {
    isActive,
    selectedSpecies,
    selectedBed,
    config,
    preview,
    showPreview,
    isCalculating,
    initializeBulkPlacement,
    updateConfig,
    executeBulkPlacement,
    cancelBulkPlacement,
    setShowPreview,
  } = useBulkPlacementStore();

  const setPreview = useBulkPlacementStore(state => state.setPreview);
  const setIsCalculating = useBulkPlacementStore(state => state.setIsCalculating);
  const getPlacementsForBed = usePlantPlacementStore(state => state.getPlacementsForBed);

  const calculatePreview = useCallback(async () => {
    if (!selectedSpecies || !selectedBed || !config) {
      setPreview(null);
      return;
    }

    setIsCalculating(true);

    try {
      const existingPlacements = getPlacementsForBed(selectedBed.id);
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
  
  useEffect(() => {
    if (isActive && config) {
      calculatePreview();
    }
  }, [isActive, config, calculatePreview]);


  const canExecute = preview && preview.positions.length > 0;
  const hasConflicts = preview && preview.conflicts > 0;

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
    executeBulkPlacement,
    cancelBulkPlacement,
    setShowPreview,

    // Computed
    canExecute,
    hasConflicts,
  };
};
