
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { PlantSpecies, CompatibilityLevel } from '../types/species.types';
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

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'trees': return '🌳';
      case 'shrubs': return '🌿';
      case 'ground-cover': return '🍃';
      case 'herbs': return '🌱';
      default: return '🌿';
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

  const compatibility = getCompatibilityInfo(species.companionCompatibility);

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
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl",
            isSelected 
              ? "bg-blue-200 ring-1 ring-blue-300" 
              : "bg-green-100"
          )}>
            {getCategoryEmoji(species.category)}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header with Name and Action */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className={cn(
                  "font-semibold text-base leading-tight mb-1",
                  isSelected ? "text-blue-900" : "text-gray-900"
                )}>
                  {species.commonName}
                </h4>
                <p className={cn(
                  "text-sm italic",
                  isSelected ? "text-blue-700" : "text-gray-600"
                )}>
                  {species.scientificName}
                </p>
              </div>

              {/* Action Indicator */}
              <div className="ml-2 flex-shrink-0">
                {isLoading ? (
                  <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                ) : isPlacing && isSelected ? (
                  <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className={cn(
                    "h-8 w-8 rounded flex items-center justify-center text-xs font-medium transition-colors",
                    isSelected 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                  )}>
                    +
                  </div>
                )}
              </div>
            </div>

            {/* Compatibility Badge */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm">{compatibility.icon}</span>
              <span className={cn(
                "text-xs font-medium",
                isSelected ? "text-blue-700" : "text-gray-600"
              )}>
                {species.companionCompatibility === 'high' ? 'Alta' : 
                 species.companionCompatibility === 'medium' ? 'Média' : 'Baixa'}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                isSelected 
                  ? "text-blue-700 bg-blue-200" 
                  : "text-gray-500 bg-gray-100"
              )}>
                {getCategoryLabel(species.category)}
              </span>
            </div>

            {/* Status/Action Text */}
            <div className="mt-2">
              {isSelected && isPlacing ? (
                <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Clique no canteiro para plantar
                </p>
              ) : isSelected ? (
                <p className="text-xs font-medium text-blue-600">
                  ✓ Selecionada - pronta para plantar
                </p>
              ) : (
                <p className={cn(
                  "text-xs",
                  disabled ? "text-gray-400" : "text-gray-500"
                )}>
                  Clique para selecionar e plantar
                </p>
              )}
            </div>

            {/* Size Info - Compact */}
            <div className="mt-1">
              <p className={cn(
                "text-xs",
                isSelected ? "text-blue-600" : "text-gray-500"
              )}>
                {species.matureSize.height}m × {species.matureSize.width}m
              </p>
            </div>
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
