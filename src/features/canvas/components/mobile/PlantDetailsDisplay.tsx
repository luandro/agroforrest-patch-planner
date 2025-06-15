
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PlantPlacement } from '../../stores/plantPlacementStore';

interface PlantDetailsDisplayProps {
  placement: PlantPlacement;
}

export const PlantDetailsDisplay: React.FC<PlantDetailsDisplayProps> = ({ placement }) => {
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'trees': return 'bg-green-700 text-white';
      case 'shrubs': return 'bg-green-500 text-white';
      case 'ground-cover': return 'bg-green-300 text-green-800';
      case 'herbs': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'trees': return 'Árvore';
      case 'shrubs': return 'Arbusto';
      case 'ground-cover': return 'Cobertura';
      case 'herbs': return 'Erva';
      default: return category;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🌱</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {placement.species.commonName}
            </span>
            <Badge className={getCategoryBadgeColor(placement.species.category)}>
              {getCategoryLabel(placement.species.category)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 italic">
            {placement.species.scientificName}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Posição:</span>
          <div className="font-medium">
            {placement.position.x.toFixed(1)}m, {placement.position.y.toFixed(1)}m
          </div>
        </div>
        <div>
          <span className="text-gray-500">Espaçamento:</span>
          <div className="font-medium">2.0m</div>
        </div>
      </div>

      {placement.notes && (
        <div className="bg-white p-3 rounded border">
          <span className="text-gray-500 text-sm">Observações:</span>
          <p className="text-sm text-gray-800 mt-1">{placement.notes}</p>
        </div>
      )}
    </div>
  );
};
