
import React from 'react';
import { PlantCategory } from '../types/species.types';
import { Trees, Shrub, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardIconProps {
  category: PlantCategory;
  isSelected: boolean;
  size?: 'sm' | 'md';
}

export const PlantSpeciesCardIcon: React.FC<PlantSpeciesCardIconProps> = ({
  category,
  isSelected,
  size = 'md'
}) => {
  const getIcon = () => {
    switch (category) {
      case 'trees':
        return Trees;
      case 'shrubs':
        return Shrub;
      case 'ground-cover':
        return Leaf; // Changed from Grass to Leaf
      case 'herbs':
        return Leaf;
      default:
        return Leaf;
    }
  };

  const Icon = getIcon();

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center flex-shrink-0",
      // Size variants
      size === 'sm' ? "w-8 h-8" : "w-10 h-10 md:w-12 md:h-12",
      // Color variants
      isSelected 
        ? "bg-blue-100 text-blue-600" 
        : "bg-gray-100 text-gray-600"
    )}>
      <Icon className={cn(
        size === 'sm' ? "w-4 h-4" : "w-5 h-5 md:w-6 md:h-6"
      )} />
    </div>
  );
};
