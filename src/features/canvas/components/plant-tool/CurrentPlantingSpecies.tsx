
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlantSpecies } from '../../types/species.types';

interface CurrentPlantingSpeciesProps {
  species: PlantSpecies;
  onCancel: () => void;
}

export const CurrentPlantingSpecies: React.FC<CurrentPlantingSpeciesProps> = ({
  species,
  onCancel
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

  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-green-900">
              {species.commonName}
            </span>
            <Badge className={getCategoryBadgeColor(species.category)}>
              {getCategoryLabel(species.category)}
            </Badge>
          </div>
          <p className="text-sm text-green-700 italic">
            {species.scientificName}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Clique no canteiro para plantar
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
