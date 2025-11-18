
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { PlantSpecies } from '../types/species.types';
import { PlantEditingPanel } from './PlantEditingPanel';
import { PlantDeletionDialog } from './PlantDeletionDialog';
import { PlantToolHeader } from './plant-tool/PlantToolHeader';
import { PlantSelectionActions } from './plant-tool/PlantSelectionActions';
import { CurrentPlantingSpecies } from './plant-tool/CurrentPlantingSpecies';
import { PlantedSpeciesSummary } from './plant-tool/PlantedSpeciesSummary';
import { PlantToolInstructions } from './plant-tool/PlantToolInstructions';

interface FocusModePlantToolProps {
  focusedBedId: string;
  onOpenPlantSelection: () => void;
  onSelectSpecies: (species: PlantSpecies) => void;
  selectedPlacementIds: string[];
  onClearSelection: () => void;
}

export const FocusModePlantTool: React.FC<FocusModePlantToolProps> = ({
  focusedBedId,
  onOpenPlantSelection,
  onSelectSpecies: _onSelectSpecies,
  selectedPlacementIds,
  onClearSelection
}) => {
  const {
    selectedSpecies,
    isPlacing,
    placements: _placements,
    getPlacementsForBed,
    removePlacements,
    setSelectedSpecies,
    clearSelection
  } = usePlantPlacementStore();

  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const bedPlacements = getPlacementsForBed(focusedBedId);
  const hasSelection = selectedPlacementIds.length > 0;
  
  const handleCancelPlacement = () => {
    setSelectedSpecies(null);
    clearSelection();
  };

  const handleDeleteSelected = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    removePlacements(selectedPlacementIds);
    setShowDeleteDialog(false);
    onClearSelection();
  };

  const handleEditSelected = () => {
    setShowEditPanel(true);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasSelection) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteSelected();
      } else if (e.key === 'F2') {
        e.preventDefault();
        handleEditSelected();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSelection, onClearSelection]);

  // Show editing panel if plants are selected
  if (hasSelection && showEditPanel) {
    return (
      <>
        <PlantEditingPanel
          focusedBedId={focusedBedId}
          selectedPlacementIds={selectedPlacementIds}
          onClose={() => setShowEditPanel(false)}
          onDelete={handleDeleteSelected}
        />
        <PlantDeletionDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          selectedPlacementIds={selectedPlacementIds}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="space-y-4">
          {/* Header */}
          <PlantToolHeader
            hasSelection={hasSelection}
            onClearSelection={onClearSelection}
          />

          {/* Enhanced Selection Actions */}
          {hasSelection && (
            <PlantSelectionActions
              selectedCount={selectedPlacementIds.length}
              onEdit={handleEditSelected}
              onDelete={handleDeleteSelected}
            />
          )}

          {/* Current Selection for Planting */}
          {!hasSelection && selectedSpecies && (
            <CurrentPlantingSpecies
              species={selectedSpecies}
              onCancel={handleCancelPlacement}
            />
          )}

          {/* Plant Selection Button */}
          {!hasSelection && !isPlacing && (
            <Button
              onClick={onOpenPlantSelection}
              className="w-full"
              variant="outline"
            >
              Selecionar Espécie para Plantar
            </Button>
          )}

          {/* Planted Species Summary */}
          {!hasSelection && (
            <PlantedSpeciesSummary placements={bedPlacements} />
          )}

          {/* Enhanced Instructions */}
          <PlantToolInstructions hasSelection={hasSelection} />
        </div>
      </div>

      {/* Deletion Dialog */}
      <PlantDeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        selectedPlacementIds={selectedPlacementIds}
      />
    </>
  );
};
