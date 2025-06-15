
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
  const bulkStore = useBulkPlacementStore();
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
    
    bulkStore.setSelectedSpecies(species);
    bulkStore.setSelectedBed(focusedBed);
    bulkStore.setConfig(defaultConfig);
    bulkStore.setActive(true);
  }, [focusedBed, bulkStore]);

  // Calculate preview
  const calculatePreview = useCallback(async () => {
    const { selectedSpecies, selectedBed, config } = bulkStore;
    
    if (!selectedSpecies || !selectedBed || !config) {
      bulkStore.setPreview(null);
      return;
    }

    bulkStore.setIsCalculating(true);
    
    try {
      // Get existing placements for the bed
      const existingPlacements = getPlacementsForBed(selectedBed.id);
      
      // Calculate bulk placement
      const preview = calculateBulkPlacement(
        selectedBed,
        selectedSpecies,
        config,
        existingPlacements
      );
      
      bulkStore.setPreview(preview);
    } catch (error) {
      console.error('Error calculating bulk placement:', error);
      bulkStore.setPreview(null);
    } finally {
      bulkStore.setIsCalculating(false);
    }
  }, [bulkStore, getPlacementsForBed]);

  // Update config and recalculate
  const updateConfig = useCallback((updates: Partial<BulkPlacementConfig>) => {
    bulkStore.updateConfig(updates);
    calculatePreview();
  }, [bulkStore, calculatePreview]);

  // Execute bulk placement
  const executeBulkPlacement = useCallback(() => {
    const { selectedSpecies, selectedBed, preview } = bulkStore;
    
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
    bulkStore.reset();
    bulkStore.setActive(false);
    
    return true;
  }, [bulkStore, addPlacement]);

  // Cancel bulk placement
  const cancelBulkPlacement = useCallback(() => {
    bulkStore.setShowPreview(false);
    bulkStore.setActive(false);
  }, [bulkStore]);

  // Auto-calculate preview when config changes
  useEffect(() => {
    if (bulkStore.isActive && bulkStore.config) {
      calculatePreview();
    }
  }, [bulkStore.isActive, bulkStore.config, calculatePreview]);

  return {
    // State
    isActive: bulkStore.isActive,
    selectedSpecies: bulkStore.selectedSpecies,
    selectedBed: bulkStore.selectedBed,
    config: bulkStore.config,
    preview: bulkStore.preview,
    showPreview: bulkStore.showPreview,
    isCalculating: bulkStore.isCalculating,
    
    // Actions
    initializeBulkPlacement,
    updateConfig,
    calculatePreview,
    executeBulkPlacement,
    cancelBulkPlacement,
    setShowPreview: bulkStore.setShowPreview,
    
    // Computed
    canExecute: bulkStore.preview && bulkStore.preview.positions.length > 0,
    hasConflicts: bulkStore.preview && bulkStore.preview.conflicts > 0
  };
};
