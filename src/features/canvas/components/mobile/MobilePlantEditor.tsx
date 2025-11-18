
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';
import { PlantDeletionDialog } from '../PlantDeletionDialog';
import { PlantDetailsDisplay } from './PlantDetailsDisplay';
import { PlantSummaryDisplay } from './PlantSummaryDisplay';
import { PlantEditorActions } from './PlantEditorActions';

interface MobilePlantEditorProps {
  selectedPlacementIds: string[];
  onClose: () => void;
  focusedBedId: string;
}

export const MobilePlantEditor: React.FC<MobilePlantEditorProps> = ({
  selectedPlacementIds,
  onClose,
  focusedBedId: _focusedBedId
}) => {
  const { placements, removePlacements } = usePlantPlacementStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const selectedPlacements = placements.filter(p => selectedPlacementIds.includes(p.id));
  const isSingle = selectedPlacementIds.length === 1;
  const singlePlacement = isSingle ? selectedPlacements[0] : null;

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    removePlacements(selectedPlacementIds);
    setShowDeleteDialog(false);
    onClose();
  };

  const handleEditDetails = () => {
    // TODO: Implement detailed editing
    console.log('Open detailed editing');
  };

  const handleMoreOptions = () => {
    // TODO: Implement more options menu
    console.log('More options');
  };

  return (
    <>
      {/* Mobile Panel - Bottom sheet style */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-xl border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {isSingle ? 'Editar Planta' : `Editar ${selectedPlacementIds.length} Plantas`}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Selection Display */}
          {isSingle && singlePlacement ? (
            <PlantDetailsDisplay placement={singlePlacement} />
          ) : (
            <PlantSummaryDisplay 
              placements={selectedPlacements}
              selectedCount={selectedPlacementIds.length}
            />
          )}

          {/* Quick Info */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            💡 Toque e segure uma planta para mais opções de edição detalhada
          </div>
        </div>

        {/* Actions */}
        <PlantEditorActions
          selectedCount={selectedPlacementIds.length}
          onEditDetails={handleEditDetails}
          onMoreOptions={handleMoreOptions}
          onDelete={handleDelete}
        />
      </div>

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-[49]"
        onClick={onClose}
      />

      {/* Delete Confirmation Dialog */}
      <PlantDeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        selectedPlacementIds={selectedPlacementIds}
      />
    </>
  );
};
