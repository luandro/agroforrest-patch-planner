
import React from 'react';
import { Check, Loader2, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardActionProps {
  isSelected: boolean;
  isPlacing: boolean;
  isLoading: boolean;
  size?: 'sm' | 'md';
}

export const PlantSpeciesCardAction: React.FC<PlantSpeciesCardActionProps> = ({
  isSelected,
  isPlacing,
  isLoading,
  size = 'md'
}) => {
  const iconSize = size === 'sm' ? "w-3 h-3" : "w-4 h-4";
  const containerSize = size === 'sm' ? "w-6 h-6" : "w-8 h-8";

  if (isLoading) {
    return (
      <div className={cn(
        "rounded-full bg-blue-100 flex items-center justify-center",
        containerSize
      )}>
        <Loader2 className={cn("text-blue-600 animate-spin", iconSize)} />
      </div>
    );
  }

  if (isPlacing && isSelected) {
    return (
      <div className={cn(
        "rounded-full bg-green-100 flex items-center justify-center",
        containerSize
      )}>
        <MousePointer className={cn("text-green-600", iconSize)} />
      </div>
    );
  }

  if (isSelected) {
    return (
      <div className={cn(
        "rounded-full bg-blue-100 flex items-center justify-center",
        containerSize
      )}>
        <Check className={cn("text-blue-600", iconSize)} />
      </div>
    );
  }

  return null;
};
