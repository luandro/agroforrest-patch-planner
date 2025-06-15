
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlantSpecies } from '../types/species.types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface PlantSelectionHeaderProps {
  onClose: () => void;
  isPlacing: boolean;
  selectedSpecies: PlantSpecies | null;
  selectedBedId?: string;
}

export const PlantSelectionHeader: React.FC<PlantSelectionHeaderProps> = ({
  onClose,
  isPlacing,
  selectedSpecies,
  selectedBedId
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "border-b border-gray-200 bg-white flex-shrink-0",
      isMobile ? "p-3" : "p-4"
    )}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className={cn(
            "font-semibold text-gray-900 truncate",
            isMobile ? "text-base" : "text-lg"
          )}>
            Selecionar Plantas
          </h2>
          {isPlacing && selectedSpecies && (
            <p className={cn(
              "text-green-600 font-medium truncate mt-0.5",
              isMobile ? "text-xs" : "text-sm"
            )}>
              ✓ {selectedSpecies.commonName}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={cn("flex-shrink-0 ml-2", isMobile ? "h-8 w-8 p-0" : "p-2")}
        >
          <X className={cn(isMobile ? "w-4 h-4" : "w-4 h-4")} />
        </Button>
      </div>
      
      {/* Only show instruction on desktop or when not placing */}
      {(!isMobile || !isPlacing) && selectedBedId && (
        <p className={cn(
          "text-gray-600 mt-1 text-xs",
          isMobile && "hidden"
        )}>
          {isPlacing 
            ? "Clique no canteiro para plantar"
            : "Clique em uma espécie para plantar"
          }
        </p>
      )}
    </div>
  );
};
