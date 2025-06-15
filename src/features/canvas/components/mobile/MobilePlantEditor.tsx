
import React, { useState } from 'react';
import { X, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';
import { PlantDeletionDialog } from '../PlantDeletionDialog';

interface MobilePlantEditorProps {
  selectedPlacementIds: string[];
  onClose: () => void;
  focusedBedId: string;
}

export const MobilePlantEditor: React.FC<MobilePlantEditorProps> = ({
  selectedPlacementIds,
  onClose,
  focusedBedId
}) => {
  const { placements, removePlacements } = usePlantPlacementStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const selectedPlacements = placements.filter(p => selectedPlacementIds.includes(p.id));

  // Group by species for summary
  const speciesGroups = selectedPlacements.reduce((acc, placement) => {
    const speciesName = placement.species.commonName;
    acc[speciesName] = (acc[speciesName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'trees': return 'bg-green-700 text-white';
      case 'shrubs': return 'bg-green-500 text-white';
      case 'ground-cover': return 'bg-green-300 text-green-800';
      case 'herbs': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'trees': return 'Árvore';
      case 'shrubs': return 'Arbusto';
      case 'ground-cover': return 'Cobertura';
      case 'herbs': return 'Erva';
      default: return category;
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    removePlacements(selectedPlacementIds);
    setShowDeleteDialog(false);
    onClose();
  };

  const isSingle = selectedPlacementIds.length === 1;
  const singlePlacement = isSingle ? selectedPlacements[0] : null;

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
          {/* Selection Summary */}
          {isSingle && singlePlacement ? (
            /* Single plant details */
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🌱</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {singlePlacement.species.commonName}
                    </span>
                    <Badge className={getCategoryBadgeColor(singlePlacement.species.category)}>
                      {getCategoryLabel(singlePlacement.species.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {singlePlacement.species.scientificName}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Posição:</span>
                  <div className="font-medium">
                    {singlePlacement.position.x.toFixed(1)}m, {singlePlacement.position.y.toFixed(1)}m
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Espaçamento:</span>
                  <div className="font-medium">2.0m</div>
                </div>
              </div>

              {singlePlacement.notes && (
                <div className="bg-white p-3 rounded border">
                  <span className="text-gray-500 text-sm">Observações:</span>
                  <p className="text-sm text-gray-800 mt-1">{singlePlacement.notes}</p>
                </div>
              )}
            </div>
          ) : (
            /* Multiple plants summary */
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="text-sm font-medium text-gray-900">
                {selectedPlacementIds.length} plantas selecionadas:
              </div>
              <div className="space-y-2">
                {Object.entries(speciesGroups).map(([speciesName, count]) => (
                  <div key={speciesName} className="flex justify-between items-center">
                    <span className="text-sm">{speciesName}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            💡 Toque e segure uma planta para mais opções de edição detalhada
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="h-12 flex items-center gap-2"
              onClick={() => {
                // TODO: Implement detailed editing
                console.log('Open detailed editing');
              }}
            >
              <Edit className="w-5 h-5" />
              Editar Detalhes
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="h-12 flex items-center gap-2"
              onClick={() => {
                // TODO: Implement more options menu
                console.log('More options');
              }}
            >
              <MoreHorizontal className="w-5 h-5" />
              Mais Opções
            </Button>
          </div>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            className="w-full h-12 flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Deletar {isSingle ? 'Planta' : `${selectedPlacementIds.length} Plantas`}
          </Button>
        </div>
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
