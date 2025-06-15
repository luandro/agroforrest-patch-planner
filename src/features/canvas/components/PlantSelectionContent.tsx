
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlantSpecies, PlantCategory } from '../types/species.types';
import { PlantSpeciesCard } from './PlantSpeciesCard';

interface PlantSelectionContentProps {
  filteredSpecies: PlantSpecies[];
  speciesByCategory: Record<PlantCategory, PlantSpecies[]>;
  selectedCategory: PlantCategory | 'all';
  selectedSpecies: PlantSpecies | null;
  isPlacing: boolean;
  onSelectSpecies: (species: PlantSpecies) => void;
}

export const PlantSelectionContent: React.FC<PlantSelectionContentProps> = ({
  filteredSpecies,
  speciesByCategory,
  selectedCategory,
  selectedSpecies,
  isPlacing,
  onSelectSpecies
}) => {
  const categoryLabels: Record<PlantCategory, string> = {
    'trees': 'Árvores',
    'shrubs': 'Arbustos',
    'ground-cover': 'Cobertura de Solo',
    'herbs': 'Ervas'
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-6">
        {selectedCategory === 'all' ? (
          // Show by categories
          Object.entries(speciesByCategory).map(([category, species]) => {
            if (species.length === 0) return null;
            
            return (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-700 mb-3 sticky top-0 bg-white/95 backdrop-blur-sm py-1">
                  {categoryLabels[category as PlantCategory]} ({species.length})
                </h3>
                <div className="space-y-3">
                  {species.map(speciesItem => (
                    <PlantSpeciesCard
                      key={speciesItem.id}
                      species={speciesItem}
                      onSelect={() => onSelectSpecies(speciesItem)}
                      isSelected={selectedSpecies?.id === speciesItem.id}
                      isPlacing={isPlacing && selectedSpecies?.id === speciesItem.id}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Show flat list when category is selected
          <div className="space-y-3">
            {filteredSpecies.map(species => (
              <PlantSpeciesCard
                key={species.id}
                species={species}
                onSelect={() => onSelectSpecies(species)}
                isSelected={selectedSpecies?.id === species.id}
                isPlacing={isPlacing && selectedSpecies?.id === species.id}
              />
            ))}
          </div>
        )}

        {filteredSpecies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma espécie encontrada</p>
            <p className="text-sm text-gray-400 mt-1">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
