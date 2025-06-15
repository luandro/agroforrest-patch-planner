
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlantSpecies } from '../types/species.types';
import { PlantSpeciesCardIcon } from './PlantSpeciesCardIcon';
import { PlantSpeciesCardContent } from './PlantSpeciesCardContent';
import { PlantSpeciesCardAction } from './PlantSpeciesCardAction';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardProps {
  species: PlantSpecies;
  onSelect: () => void;
  isSelected?: boolean;
  isPlacing?: boolean;
  disabled?: boolean;
}

export const PlantSpeciesCard: React.FC<PlantSpeciesCardProps> = ({
  species,
  onSelect,
  isSelected = false,
  isPlacing = false,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    if (disabled) return;
    
    setIsLoading(true);
    // Simulate brief loading state for visual feedback
    setTimeout(() => {
      onSelect();
      setIsLoading(false);
    }, 100);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 min-h-[110px] touch-manipulation",
        // Base state
        "border border-gray-200 bg-white hover:bg-blue-50",
        // Selected state
        isSelected && "ring-2 ring-blue-500 bg-blue-50 border-blue-300",
        // Disabled state
        disabled && "opacity-50 cursor-not-allowed bg-gray-50",
        // Hover effects (only when not disabled)
        !disabled && !isSelected && "hover:border-blue-300 hover:shadow-sm",
        // Active/placing state
        isPlacing && isSelected && "bg-blue-100 ring-blue-600"
      )}
      onClick={handleSelect}
    >
      <CardContent className="p-4">
        <div className="flex gap-3 items-start">
          {/* Plant Icon */}
          <PlantSpeciesCardIcon
            category={species.category}
            isSelected={isSelected}
          />

          {/* Main Content */}
          <PlantSpeciesCardContent
            species={species}
            isSelected={isSelected}
            isPlacing={isPlacing}
            disabled={disabled}
          />

          {/* Action Indicator */}
          <div className="ml-2 flex-shrink-0">
            <PlantSpeciesCardAction
              isSelected={isSelected}
              isPlacing={isPlacing}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Disabled Overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-gray-200/50 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
              Incompatível
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
