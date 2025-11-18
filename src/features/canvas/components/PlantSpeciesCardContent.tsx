
import React from 'react';
import { PlantSpecies } from '../types/species.types';
import { PlantSpeciesCardBadges } from './PlantSpeciesCardBadges';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardContentProps {
  species: PlantSpecies;
  isSelected: boolean;
  isPlacing: boolean;
  disabled: boolean;
  compact?: boolean;
}

export const PlantSpeciesCardContent: React.FC<PlantSpeciesCardContentProps> = ({
  species,
  isSelected,
  isPlacing,
  disabled: _disabled,
  compact = false
}) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col">
        <h3 className={cn(
          "font-medium text-gray-900 truncate",
          compact ? "text-sm" : "text-sm md:text-base"
        )}>
          {species.commonName}
        </h3>
        <p className={cn(
          "text-gray-600 italic truncate",
          compact ? "text-xs" : "text-xs md:text-sm"
        )}>
          {species.scientificName}
        </p>
      </div>

      {/* Spacing info - only show on larger cards or when selected */}
      {(!compact || isSelected) && (
        <div className={cn(
          "text-gray-500 mt-1",
          compact ? "text-xs" : "text-xs md:text-sm"
        )}>
          Espaçamento: {species.spacing.min}-{species.spacing.max}m
        </div>
      )}

      {/* Badges - simplified for compact mode */}
      <div className={cn("mt-1", compact ? "mt-1" : "mt-2")}>
        <PlantSpeciesCardBadges 
          species={species} 
          compact={compact}
        />
      </div>

      {/* Status indicators */}
      {isPlacing && isSelected && (
        <div className={cn(
          "text-blue-600 font-medium mt-1",
          compact ? "text-xs" : "text-xs md:text-sm"
        )}>
          Clique no canteiro para plantar
        </div>
      )}
    </div>
  );
};
