
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardActionProps {
  isSelected: boolean;
  isPlacing: boolean;
  isLoading: boolean;
}

export const PlantSpeciesCardAction: React.FC<PlantSpeciesCardActionProps> = ({
  isSelected,
  isPlacing,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center">
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      </div>
    );
  }

  if (isPlacing && isSelected) {
    return (
      <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
    );
  }

  return (
    <div className={cn(
      "h-8 w-8 rounded flex items-center justify-center text-xs font-medium transition-colors",
      isSelected 
        ? "bg-blue-500 text-white" 
        : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
    )}>
      +
    </div>
  );
};
