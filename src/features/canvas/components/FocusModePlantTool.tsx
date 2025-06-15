
import React from 'react';
import { X, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { PlantSpecies } from '../types/species.types';

interface FocusModePlantToolProps {
  focusedBedId: string;
  onOpenPlantSelection: () => void;
  onSelectSpecies: (species: PlantSpecies) => void;
}

export const FocusModePlantTool: React.FC<FocusModePlantToolProps> = ({
  focusedBedId,
  onOpenPlantSelection,
  onSelectSpecies
}) => {
  const {
    selectedSpecies,
    isPlacing,
    placements,
    selectedPlacementIds,
    getPlacementsForBed,
    removePlacements,
    setSelectedSpecies,
    clearSelection
  } = usePlantPlacementStore();

  const bedPlacements = getPlacementsForBed(focusedBedId);
  
  const handleCancelPlacement = () => {
    setSelectedSpecies(null);
    clearSelection();
  };

  const handleDeleteSelected = () => {
    if (selectedPlacementIds.length > 0) {
      removePlacements(selectedPlacementIds);
    }
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

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Plantar Espécies</h3>
          {selectedPlacementIds.length > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Excluir ({selectedPlacementIds.length})
            </Button>
          )}
        </div>

        {/* Current Selection */}
        {selectedSpecies && (
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
        {!isPlacing && (
          <Button
            onClick={onOpenPlantSelection}
            className="w-full"
            variant="outline"
          >
            Selecionar Espécie para Plantar
          </Button>
        )}

        {/* Planted Species Summary */}
        {bedPlacements.length > 0 && (
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
              <p>• Selecione uma espécie e clique no canteiro para plantar</p>
              <p>• As plantas se encaixam numa grade de 10cm</p>
              <p>• Clique nas plantas para selecioná-las</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
