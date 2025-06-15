
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { PlantSpecies, CompatibilityLevel } from '../types/species.types';

interface PlantSpeciesCardProps {
  species: PlantSpecies;
  onSelect: () => void;
}

export const PlantSpeciesCard: React.FC<PlantSpeciesCardProps> = ({
  species,
  onSelect
}) => {
  const getCompatibilityColor = (level: CompatibilityLevel) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCompatibilityLabel = (level: CompatibilityLevel) => {
    switch (level) {
      case 'high': return 'Alta compatibilidade';
      case 'medium': return 'Compatibilidade média';
      case 'low': return 'Baixa compatibilidade';
      default: return 'Compatibilidade desconhecida';
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Plant Image Placeholder */}
          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🌱</span>
          </div>

          {/* Plant Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                  {species.commonName}
                </h4>
                <p className="text-xs text-gray-600 italic mt-0.5">
                  {species.scientificName}
                </p>
              </div>

              <Button
                size="sm"
                onClick={onSelect}
                className="ml-2 h-8 w-8 p-0 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-2">
              {/* Compatibility Indicator */}
              <div className="flex items-center gap-1">
                <div 
                  className={`w-2 h-2 rounded-full ${getCompatibilityColor(species.companionCompatibility)}`}
                  title={getCompatibilityLabel(species.companionCompatibility)}
                />
                <span className="text-xs text-gray-600">
                  {species.companionCompatibility === 'high' ? 'Alta' : 
                   species.companionCompatibility === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>

              {/* Category */}
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {getCategoryLabel(species.category)}
              </span>
            </div>

            {/* Size Info */}
            <div className="mt-2">
              <p className="text-xs text-gray-600">
                Tamanho: {species.matureSize.height}m × {species.matureSize.width}m
              </p>
            </div>

            {/* Description */}
            {species.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {species.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
