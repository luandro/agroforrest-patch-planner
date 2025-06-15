
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';

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
