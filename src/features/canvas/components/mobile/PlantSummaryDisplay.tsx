
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PlantPlacement } from '../../stores/plantPlacementStore';

interface PlantSummaryDisplayProps {
  placements: PlantPlacement[];
  selectedCount: number;
}

export const PlantSummaryDisplay: React.FC<PlantSummaryDisplayProps> = ({ 
  placements, 
  selectedCount 
}) => {
  // Group by species for summary
  const speciesGroups = placements.reduce((acc, placement) => {
    const speciesName = placement.species.commonName;
    acc[speciesName] = (acc[speciesName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="text-sm font-medium text-gray-900">
        {selectedCount} plantas selecionadas:
      </div>
      <div className="space-y-2">
        {Object.entries(speciesGroups).map(([speciesName, count]) => (
          <div key={speciesName} className="flex justify-between items-center">
            <span className="text-sm">{speciesName}</span>
            <Badge variant="secondary">{count}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
