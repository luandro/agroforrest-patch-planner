
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlantSpecies } from '../../types/species.types';

interface MinimalPlantModeIndicatorProps {
  isTimelineActive: boolean;
  selectedSpecies: PlantSpecies | null;
  onOpenPlantSelection?: () => void;
}

export const MinimalPlantModeIndicator: React.FC<MinimalPlantModeIndicatorProps> = ({
  isTimelineActive,
  selectedSpecies,
  onOpenPlantSelection
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-collapse after 3 seconds when expanded
  useEffect(() => {
    if (isExpanded && isTimelineActive) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, isTimelineActive]);

  // Collapse when timeline becomes active
  useEffect(() => {
    if (isTimelineActive) {
      setIsExpanded(false);
    }
  }, [isTimelineActive]);

  if (isTimelineActive && !isExpanded) {
    // Minimal collapsed state - small floating icon
    return (
      <div className="fixed top-20 left-4 z-30">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-10 h-10 p-0 bg-green-600 text-white border-green-700 shadow-lg"
          title="Expandir Modo Plantio"
        >
          <Leaf className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Expanded state or when timeline is not active
  return (
    <div className={cn(
      "fixed top-20 left-4 z-30 transition-all duration-300",
      isTimelineActive && "opacity-90"
    )}>
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Modo Plantio
          </Badge>
          {isTimelineActive && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
          )}
        </div>

        {selectedSpecies ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">
              {selectedSpecies.commonName}
            </div>
            <div className="text-xs text-gray-600">
              {selectedSpecies.scientificName}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenPlantSelection}
              className="w-full text-xs h-7"
            >
              Trocar Espécie
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Nenhuma espécie selecionada
            </div>
            <Button
              size="sm"
              onClick={onOpenPlantSelection}
              className="w-full text-xs h-7 bg-green-600 hover:bg-green-700"
            >
              Selecionar Espécie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
