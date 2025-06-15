
import React from 'react';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardIconProps {
  category: string;
  isSelected: boolean;
}

export const PlantSpeciesCardIcon: React.FC<PlantSpeciesCardIconProps> = ({
  category,
  isSelected
}) => {
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'trees': return '🌳';
      case 'shrubs': return '🌿';
      case 'ground-cover': return '🍃';
      case 'herbs': return '🌱';
      default: return '🌿';
    }
  };

  return (
    <div className={cn(
      "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl",
      isSelected 
        ? "bg-blue-200 ring-1 ring-blue-300" 
        : "bg-green-100"
    )}>
      {getCategoryEmoji(category)}
    </div>
  );
};
