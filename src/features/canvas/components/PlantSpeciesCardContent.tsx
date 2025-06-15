
import React from 'react';
import { Check } from 'lucide-react';
import { PlantSpecies } from '../types/species.types';
import { PlantSpeciesCardBadges } from './PlantSpeciesCardBadges';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardContentProps {
  species: PlantSpecies;
  isSelected: boolean;
  isPlacing: boolean;
  disabled: boolean;
}

export const PlantSpeciesCardContent: React.FC<PlantSpeciesCardContentProps> = ({
  species,
  isSelected,
  isPlacing,
  disabled
}) => {
  return (
    <div className="flex-1 min-w-0">
      {/* Header with Name */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className={cn(
            "font-semibold text-base leading-tight mb-1",
            isSelected ? "text-blue-900" : "text-gray-900"
          )}>
            {species.commonName}
          </h4>
          <p className={cn(
            "text-sm italic",
            isSelected ? "text-blue-700" : "text-gray-600"
          )}>
            {species.scientificName}
          </p>
        </div>
      </div>

      {/* Compatibility Badge */}
      <PlantSpeciesCardBadges
        companionCompatibility={species.companionCompatibility}
        category={species.category}
        isSelected={isSelected}
      />

      {/* Status/Action Text */}
      <div className="mt-2">
        {isSelected && isPlacing ? (
          <p className="text-xs font-medium text-green-600 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Clique no canteiro para plantar
          </p>
        ) : isSelected ? (
          <p className="text-xs font-medium text-blue-600">
            ✓ Selecionada - pronta para plantar
          </p>
        ) : (
          <p className={cn(
            "text-xs",
            disabled ? "text-gray-400" : "text-gray-500"
          )}>
            Clique para selecionar e plantar
          </p>
        )}
      </div>

      {/* Size Info - Compact */}
      <div className="mt-1">
        <p className={cn(
          "text-xs",
          isSelected ? "text-blue-600" : "text-gray-500"
        )}>
          {species.matureSize.height}m × {species.matureSize.width}m
        </p>
      </div>
    </div>
  );
};
