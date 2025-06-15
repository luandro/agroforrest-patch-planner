
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlantPlacement } from '../../stores/plantPlacementStore';
import { PlantSpecies } from '../../types/species.types';

interface PlantedSpeciesSummaryProps {
  placements: PlantPlacement[];
}

export const PlantedSpeciesSummary: React.FC<PlantedSpeciesSummaryProps> = ({
  placements
}) => {
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

  if (placements.length === 0) {
    return null;
  }

  // Group by species
  const groupedBySpecies = placements.reduce((acc, placement) => {
    const key = placement.species.id;
    if (!acc[key]) {
      acc[key] = {
        species: placement.species,
        count: 0
      };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, { species: PlantSpecies; count: number }>);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">
        Plantas no Canteiro ({placements.length})
      </h4>
      
      <ScrollArea className="max-h-32">
        <div className="space-y-1">
          {Object.entries(groupedBySpecies).map(([speciesId, { species, count }]) => (
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
  );
};
