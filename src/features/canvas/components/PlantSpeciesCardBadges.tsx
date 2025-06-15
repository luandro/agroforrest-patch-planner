
import React from 'react';
import { CompatibilityLevel } from '../types/species.types';
import { cn } from '@/lib/utils';

interface PlantSpeciesCardBadgesProps {
  companionCompatibility: CompatibilityLevel;
  category: string;
  isSelected: boolean;
}

export const PlantSpeciesCardBadges: React.FC<PlantSpeciesCardBadgesProps> = ({
  companionCompatibility,
  category,
  isSelected
}) => {
  const getCompatibilityInfo = (level: CompatibilityLevel) => {
    switch (level) {
      case 'high': 
        return { 
          color: 'bg-emerald-500', 
          label: 'Alta compatibilidade',
          icon: '🟢'
        };
      case 'medium': 
        return { 
          color: 'bg-yellow-500', 
          label: 'Compatibilidade média',
          icon: '🟡'
        };
      case 'low': 
        return { 
          color: 'bg-red-500', 
          label: 'Baixa compatibilidade',
          icon: '🔴'
        };
      default: 
        return { 
          color: 'bg-gray-500', 
          label: 'Compatibilidade desconhecida',
          icon: '⚪'
        };
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

  const compatibility = getCompatibilityInfo(companionCompatibility);

  return (
    <div className="flex items-center gap-1 mb-2">
      <span className="text-sm">{compatibility.icon}</span>
      <span className={cn(
        "text-xs font-medium",
        isSelected ? "text-blue-700" : "text-gray-600"
      )}>
        {companionCompatibility === 'high' ? 'Alta' : 
         companionCompatibility === 'medium' ? 'Média' : 'Baixa'}
      </span>
      <span className={cn(
        "text-xs px-2 py-0.5 rounded-full",
        isSelected 
          ? "text-blue-700 bg-blue-200" 
          : "text-gray-500 bg-gray-100"
      )}>
        {getCategoryLabel(category)}
      </span>
    </div>
  );
};
