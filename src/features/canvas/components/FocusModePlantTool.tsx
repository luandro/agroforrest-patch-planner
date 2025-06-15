
import React, { useState } from 'react';
import { X, Trash2, Info, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { PlantSpecies } from '../types/species.types';
import { PlantEditingPanel } from './PlantEditingPanel';
import { PlantDeletionDialog } from './PlantDeletionDialog';

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
  onSelectSpecies,
  selectedPlacementIds,
  onClearSelection
}) => {
  const {
    selectedSpecies,
    isPlacing,
    placements,
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
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {hasSelection ? 'Plantas Selecionadas' : 'Plantar Espécies'}
            </h3>
            {hasSelection && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClearSelection}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Selection Actions */}
          {hasSelection && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                {selectedPlacementIds.length} planta{selectedPlacementIds.length > 1 ? 's' : ''} selecionada{selectedPlacementIds.length > 1 ? 's' : ''}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEditSelected}
                  className="flex-1 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Deletar
                </Button>
              </div>
            </div>
          )}

          {/* Current Selection for Planting */}
          {!hasSelection && selectedSpecies && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-green-900">
                      {selectedSpecies.commonName}
                    </span>
                    <Badge className={getCategoryBadgeColor(selectedSpecies.category)}>
                      {getCategoryLabel(selectedSpecies.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 italic">
                    {selectedSpecies.scientificName}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Clique no canteiro para plantar
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelPlacement}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
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
          {!hasSelection && bedPlacements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Plantas no Canteiro ({bedPlacements.length})
              </h4>
              
              <ScrollArea className="max-h-32">
                <div className="space-y-1">
                  {/* Group by species */}
                  {Object.entries(
                    bedPlacements.reduce((acc, placement) => {
                      const key = placement.species.id;
                      if (!acc[key]) {
                        acc[key] = {
                          species: placement.species,
                          count: 0
                        };
                      }
                      acc[key].count++;
                      return acc;
                    }, {} as Record<string, { species: PlantSpecies; count: number }>)
                  ).map(([speciesId, { species, count }]) => (
                    <div
                      key={speciesId}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{species.commonName}</span>
                        <Badge 
                          variant="secondary" 
                          className={getCategoryBadgeColor(species.category)}
                        >
                          {getCategoryLabel(species.category)}
                        </Badge>
                      </div>
                      <span className="text-gray-600 font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 mt-0.5 text-blue-500" />
              <div>
                {hasSelection ? (
                  <>
                    <p>• Use os botões acima para editar ou deletar</p>
                    <p>• Clique fora para desselecionar</p>
                    <p>• Ctrl+Click para seleção múltipla</p>
                  </>
                ) : (
                  <>
                    <p>• Selecione uma espécie e clique no canteiro para plantar</p>
                    <p>• Clique nas plantas para selecioná-las</p>
                    <p>• As plantas se encaixam numa grade de 10cm</p>
                  </>
                )}
              </div>
            </div>
          </div>
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
