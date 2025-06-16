import React from 'react';
import { Patch } from '../types/patch.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MapPin, Calendar, Ruler } from 'lucide-react';

interface PatchStatisticsProps {
  patch: Patch;
  beds: Bed[];
  placements: PlantPlacement[];
}

export const PatchStatistics: React.FC<PatchStatisticsProps> = ({
  patch,
  beds,
  placements
}) => {
  // Calculate total bed area
  const totalBedArea = beds.reduce((total, bed) => {
    if (bed.shape === 'rectangle') {
      return total + ((bed.dimensions.length || 0) * (bed.dimensions.width || 0));
    } else {
      const radius = bed.dimensions.radius || 0;
      return total + (Math.PI * radius * radius);
    }
  }, 0);

  // Calculate patch area
  const patchArea = patch.size.width * patch.size.height;

  // Calculate coverage percentage
  const coveragePercentage = patchArea > 0 ? (totalBedArea / patchArea) * 100 : 0;

  // Group plants by category
  const plantsByCategory = placements.reduce((acc, placement) => {
    const category = placement.species.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate planting density (plants per square meter)
  const plantingDensity = totalBedArea > 0 ? placements.length / totalBedArea : 0;

  // Count edible plants
  const ediblePlants = placements.filter(p => p.species.isEdible).length;

  // Get creation and update dates
  const createdDate = new Date(patch.createdAt);
  const updatedDate = new Date(patch.updatedAt);
  const daysSinceCreation = Math.floor((Date.now() - patch.createdAt) / (1000 * 60 * 60 * 24));

  const formatArea = (area: number) => {
    if (area < 1) {
      return `${(area * 10000).toFixed(0)} cm²`;
    }
    return `${area.toFixed(1)} m²`;
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'trees':
        return 'Árvores';
      case 'shrubs':
        return 'Arbustos';
      case 'herbs':
        return 'Ervas';
      case 'ground-cover':
        return 'Cobertura';
      default:
        return category;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 print:border-gray-300">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Estatísticas do Patch</h3>
      </div>

      <div className="space-y-4">
        {/* Area Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg print:bg-blue-100">
            <div className="flex items-center space-x-2 mb-1">
              <Ruler className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Área Total</span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {formatArea(patchArea)}
            </div>
            <div className="text-xs text-blue-600">
              {patch.size.width}m × {patch.size.height}m
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg print:bg-green-100">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Área Plantada</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {formatArea(totalBedArea)}
            </div>
            <div className="text-xs text-green-600">
              {coveragePercentage.toFixed(1)}% do patch
            </div>
          </div>
        </div>

        {/* Bed and Plant Counts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg print:bg-gray-100">
            <div className="text-2xl font-bold text-gray-900">{beds.length}</div>
            <div className="text-sm text-gray-600">
              {beds.length === 1 ? 'Canteiro' : 'Canteiros'}
            </div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg print:bg-gray-100">
            <div className="text-2xl font-bold text-gray-900">{placements.length}</div>
            <div className="text-sm text-gray-600">
              {placements.length === 1 ? 'Planta' : 'Plantas'}
            </div>
          </div>
        </div>

        {/* Plant Categories */}
        {Object.keys(plantsByCategory).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Plantas por Categoria</h4>
            <div className="space-y-2">
              {Object.entries(plantsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getCategoryName(category)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Metrics */}
        <div className="space-y-2 pt-2 border-t border-gray-200 print:border-gray-300">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Densidade de plantio:</span>
            <span className="font-medium text-gray-900">
              {plantingDensity.toFixed(1)} plantas/m²
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plantas comestíveis:</span>
            <span className="font-medium text-gray-900">
              {ediblePlants} ({placements.length > 0 ? Math.round((ediblePlants / placements.length) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-2 border-t border-gray-200 print:border-gray-300">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Histórico</span>
          </div>
          
          <div className="space-y-1 text-xs text-gray-600">
            <div>
              <span className="font-medium">Criado:</span> {createdDate.toLocaleDateString('pt-BR')}
            </div>
            <div>
              <span className="font-medium">Atualizado:</span> {updatedDate.toLocaleDateString('pt-BR')}
            </div>
            <div>
              <span className="font-medium">Idade:</span> {daysSinceCreation} dias
            </div>
          </div>
        </div>

        {/* Location if available */}
        {patch.location && (
          <div className="pt-2 border-t border-gray-200 print:border-gray-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{patch.location}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
