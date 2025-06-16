import React from 'react';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { PlantSpecies } from '../types/species.types';
import { Badge } from '@/components/ui/badge';
import { Leaf, TreePine, Flower, Sprout } from 'lucide-react';

interface SpeciesLegendProps {
  placements: PlantPlacement[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'trees':
      return <TreePine className="w-4 h-4" />;
    case 'shrubs':
      return <Leaf className="w-4 h-4" />;
    case 'herbs':
      return <Flower className="w-4 h-4" />;
    case 'ground-cover':
      return <Sprout className="w-4 h-4" />;
    default:
      return <Leaf className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'trees':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'shrubs':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'herbs':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'ground-cover':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
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

export const SpeciesLegend: React.FC<SpeciesLegendProps> = ({ placements }) => {
  // Group placements by species
  const speciesMap = new Map<string, { species: PlantSpecies; count: number }>();

  placements.forEach(placement => {
    const speciesId = placement.species.id;
    const existing = speciesMap.get(speciesId);
    
    if (existing) {
      existing.count++;
    } else {
      speciesMap.set(speciesId, {
        species: placement.species,
        count: 1
      });
    }
  });

  // Convert to array and sort by category and name
  const speciesEntries = Array.from(speciesMap.values()).sort((a, b) => {
    // First sort by category order
    const categoryOrder = ['trees', 'shrubs', 'herbs', 'ground-cover'];
    const categoryA = categoryOrder.indexOf(a.species.category);
    const categoryB = categoryOrder.indexOf(b.species.category);
    
    if (categoryA !== categoryB) {
      return categoryA - categoryB;
    }
    
    // Then sort by name
    return a.species.commonName.localeCompare(b.species.commonName);
  });

  // Group by category for display
  const speciesByCategory = speciesEntries.reduce((acc, entry) => {
    const category = entry.species.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {} as Record<string, typeof speciesEntries>);

  if (speciesEntries.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Espécies Plantadas</h3>
        <div className="text-center text-gray-500 py-4">
          <Leaf className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Nenhuma planta foi adicionada ainda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 print:border-gray-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Espécies Plantadas</h3>
        <Badge variant="secondary" className="text-xs">
          {speciesEntries.length} espécies
        </Badge>
      </div>

      <div className="space-y-4">
        {Object.entries(speciesByCategory).map(([category, entries]) => (
          <div key={category}>
            {/* Category header */}
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1 rounded-full ${getCategoryColor(category)}`}>
                {getCategoryIcon(category)}
              </div>
              <h4 className="text-sm font-medium text-gray-700">
                {getCategoryName(category)}
              </h4>
              <Badge variant="outline" className="text-xs">
                {entries.length}
              </Badge>
            </div>

            {/* Species list */}
            <div className="space-y-2 ml-6">
              {entries.map(({ species, count }) => (
                <div
                  key={species.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg print:bg-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {species.commonName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {species.scientificName}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                    {species.isEdible && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Comestível" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200 print:border-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total de plantas:</span>
          <span className="font-medium text-gray-900">
            {placements.length}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Plantas comestíveis:</span>
          <span className="font-medium text-gray-900">
            {placements.filter(p => p.species.isEdible).length}
          </span>
        </div>
      </div>
    </div>
  );
};
