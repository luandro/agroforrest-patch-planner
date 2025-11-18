
import React from 'react';
import { PlantSpecies } from '../types/species.types';
import { useBulkPlacement } from '../hooks/useBulkPlacement';
import { PlantSelectionBulkMode } from './PlantSelectionBulkMode';

type BulkPlacementHookReturn = ReturnType<typeof useBulkPlacement>;

/**
 * Inactive state for bulk placement hook when not in use
 */
export const inactiveBulkPlacementState: BulkPlacementHookReturn = {
  isActive: false,
  selectedSpecies: null,
  selectedBed: null,
  config: null,
  preview: null,
  showPreview: false,
  isCalculating: false,
  initializeBulkPlacement: () => undefined,
  updateConfig: () => undefined,
  executeBulkPlacement: () => false,
  cancelBulkPlacement: () => undefined,
  setShowPreview: () => undefined,
  canExecute: false,
  hasConflicts: false
};

interface BulkPlacementManagerProps {
  speciesForBulk: PlantSpecies;
  onCancel: () => void;
}

/**
 * Component that manages the lifecycle of bulk placement mode
 */
export const BulkPlacementManager: React.FC<BulkPlacementManagerProps> = ({
  speciesForBulk,
  onCancel
}) => {
  const bulkPlacement = useBulkPlacement();
  const { initializeBulkPlacement, isActive } = bulkPlacement;

  // Initialize on mount
  React.useEffect(() => {
    initializeBulkPlacement(speciesForBulk);
  }, [speciesForBulk, initializeBulkPlacement]);

  const wasActiveRef = React.useRef(isActive);
  React.useEffect(() => {
    // When bulk placement is finished/cancelled, it becomes inactive.
    // We then trigger the onCancel callback to switch back to the individual tab.
    if (wasActiveRef.current && !isActive) {
      const timer = setTimeout(() => {
        onCancel();
      }, 0);
      return () => clearTimeout(timer);
    }
    wasActiveRef.current = isActive;
  }, [isActive, onCancel]);

  return <PlantSelectionBulkMode bulkPlacementProps={bulkPlacement} />;
};
