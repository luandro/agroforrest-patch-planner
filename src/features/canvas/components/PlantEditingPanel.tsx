
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePlantEditForm, getCategoryBadgeColor } from '../hooks/usePlantEditForm';
import { PlantEditFormFields } from './PlantEditFormFields';
import { PlantEditFormActions } from './PlantEditFormActions';

interface PlantEditingPanelProps {
  focusedBedId: string;
  selectedPlacementIds: string[];
  onClose: () => void;
  onDelete: () => void;
}

export const PlantEditingPanel: React.FC<PlantEditingPanelProps> = ({
  focusedBedId: _focusedBedId,
  selectedPlacementIds,
  onClose,
  onDelete
}) => {
  const {
    editForm,
    hasUnsavedChanges,
    speciesGroups,
    handleFormChange,
    handleApplyChanges
  } = usePlantEditForm({ selectedPlacementIds });

  if (selectedPlacementIds.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Editar Planta{selectedPlacementIds.length > 1 ? 's' : ''}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Selection Summary */}
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {selectedPlacementIds.length} planta{selectedPlacementIds.length > 1 ? 's' : ''} selecionada{selectedPlacementIds.length > 1 ? 's' : ''}
          </div>

          {/* Species breakdown */}
          <div className="space-y-1">
            {Object.values(speciesGroups).map(({ species, count }) => (
              <div key={species.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{species.commonName}</span>
                  <Badge className={getCategoryBadgeColor(species.category)}>
                    {species.category === 'trees' ? 'Árvore' :
                     species.category === 'shrubs' ? 'Arbusto' :
                     species.category === 'ground-cover' ? 'Cobertura' : 'Erva'}
                  </Badge>
                </div>
                <span className="text-gray-600 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Edit Form */}
        <PlantEditFormFields
          editForm={editForm}
          onFormChange={handleFormChange}
        />

        <Separator />

        {/* Actions */}
        <PlantEditFormActions
          selectedCount={selectedPlacementIds.length}
          hasUnsavedChanges={hasUnsavedChanges}
          onApplyChanges={handleApplyChanges}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};
