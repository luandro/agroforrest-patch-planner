
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Check } from 'lucide-react';
import { PlantSpecies, CompatibilityLevel } from '../types/species.types';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardProps {
  species: PlantSpecies;
  onSelect: () => void;
  isSelected?: boolean;
  isPlacing?: boolean;
}

export const PlantSpeciesCard: React.FC<PlantSpeciesCardProps> = ({
  species,
  onSelect,
  isSelected = false,
  isPlacing = false
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
    <Card className={cn(
      "cursor-pointer transition-all duration-200",
      isSelected 
        ? "ring-2 ring-green-500 bg-green-50 hover:bg-green-100" 
        : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
    )}
    onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Plant Image Placeholder */}
          <div className={cn(
            "w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0",
            isSelected ? "bg-green-200" : "bg-green-100"
          )}>
            <span className="text-2xl">🌱</span>
          </div>

          {/* Plant Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className={cn(
                  "font-medium text-sm leading-tight",
                  isSelected ? "text-green-900" : "text-gray-900"
                )}>
                  {species.commonName}
                </h4>
                <p className={cn(
                  "text-xs italic mt-0.5",
                  isSelected ? "text-green-700" : "text-gray-600"
                )}>
                  {species.scientificName}
                </p>
              </div>

              {/* Action Button/Status */}
              <div className="ml-2 flex-shrink-0">
                {isPlacing ? (
                  <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-8 w-8 p-0",
                      isSelected && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Text */}
            {isSelected && (
              <div className="mt-2">
                <p className="text-xs text-green-600 font-medium">
                  {isPlacing ? "✓ Pronta para plantar" : "✓ Selecionada"}
                </p>
              </div>
            )}

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
              <span className={cn(
                "text-xs px-2 py-0.5 rounded",
                isSelected 
                  ? "text-green-700 bg-green-200" 
                  : "text-gray-500 bg-gray-100"
              )}>
                {getCategoryLabel(species.category)}
              </span>
            </div>

            {/* Size Info */}
            <div className="mt-2">
              <p className={cn(
                "text-xs",
                isSelected ? "text-green-600" : "text-gray-600"
              )}>
                Tamanho: {species.matureSize.height}m × {species.matureSize.width}m
              </p>
            </div>

            {/* Description */}
            {species.description && (
              <p className={cn(
                "text-xs mt-1 line-clamp-2",
                isSelected ? "text-green-600" : "text-gray-600"
              )}>
                {species.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
