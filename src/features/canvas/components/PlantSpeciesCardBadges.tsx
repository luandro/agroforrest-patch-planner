
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PlantSpecies } from '../types/species.types';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardBadgesProps {
  species: PlantSpecies;
  compact?: boolean;
}

export const PlantSpeciesCardBadges: React.FC<PlantSpeciesCardBadgesProps> = ({
  species,
  compact = false
}) => {
  const badgeSize = compact ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <div className={cn("flex flex-wrap gap-1", compact && "gap-0.5")}>
      {/* Growth speed - only show in non-compact mode or for selected items */}
      {!compact && (
        <Badge 
          variant="secondary" 
          className={cn(badgeSize, "bg-green-100 text-green-700")}
        >
          {species.growthRate === 'fast' && 'Rápido'}
          {species.growthRate === 'medium' && 'Médio'}
          {species.growthRate === 'slow' && 'Lento'}
        </Badge>
      )}

      {/* Sun requirements */}
      <Badge 
        variant="secondary" 
        className={cn(badgeSize, "bg-yellow-100 text-yellow-700")}
      >
        {species.sunRequirement === 'full' && (compact ? 'Sol' : 'Sol Pleno')}
        {species.sunRequirement === 'partial' && (compact ? 'Meia' : 'Meia Sombra')}
        {species.sunRequirement === 'shade' && 'Sombra'}
      </Badge>

      {/* Water needs - only show in non-compact mode */}
      {!compact && (
        <Badge 
          variant="secondary" 
          className={cn(badgeSize, "bg-blue-100 text-blue-700")}
        >
          {species.waterRequirement === 'low' && 'Pouca Água'}
          {species.waterRequirement === 'medium' && 'Água Média'}
          {species.waterRequirement === 'high' && 'Muita Água'}
        </Badge>
      )}

      {/* Edible - priority badge, always show */}
      {species.isEdible && (
        <Badge 
          variant="secondary" 
          className={cn(badgeSize, "bg-orange-100 text-orange-700")}
        >
          {compact ? 'Comest.' : 'Comestível'}
        </Badge>
      )}
    </div>
  );
};
