
import React from 'react';
import { PlantSpecies, PlantCategory } from '../types/species.types';
import { PlantSpeciesCard } from './PlantSpeciesCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlantSelectionContentProps {
  filteredSpecies: PlantSpecies[];
  speciesByCategory: Record<PlantCategory, PlantSpecies[]>;
  selectedCategory: PlantCategory | 'all';
  selectedSpecies: PlantSpecies | null;
  isPlacing: boolean;
  onSelectSpecies: (species: PlantSpecies) => void;
  showBulkButton?: boolean;
  onBulkSelect?: (species: PlantSpecies) => void;
}

export const PlantSelectionContent: React.FC<PlantSelectionContentProps> = ({
  filteredSpecies,
  speciesByCategory,
  selectedCategory,
  selectedSpecies,
  isPlacing,
  onSelectSpecies,
  showBulkButton = false,
  onBulkSelect
}) => {
  const isMobile = useIsMobile();

  const renderSpeciesList = (species: PlantSpecies[]) => (
    <div className={isMobile ? "space-y-2" : "space-y-3"}>
      {species.map((plant) => (
        <PlantSpeciesCard
          key={plant.id}
          species={plant}
          isSelected={selectedSpecies?.id === plant.id}
          isPlacing={isPlacing && selectedSpecies?.id === plant.id}
          onSelect={() => onSelectSpecies(plant)}
          showBulkButton={showBulkButton}
          onBulkSelect={onBulkSelect ? () => onBulkSelect(plant) : undefined}
          compact={isMobile}
        />
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-4 md:px-4">
      {selectedCategory === 'all' ? (
        <div className="space-y-4 md:space-y-6">
          {Object.entries(speciesByCategory).map(([category, species]) => {
            if (species.length === 0) return null;
            
            const categoryNames = {
              'trees': 'Árvores',
              'shrubs': 'Arbustos',
              'ground-cover': 'Cobertura do Solo',
              'herbs': 'Ervas'
            };

            return (
              <div key={category}>
                <h3 className="font-medium text-gray-900 mb-2 md:mb-3 border-b border-gray-200 pb-1 text-sm md:text-base">
                  {categoryNames[category as PlantCategory]} ({species.length})
                </h3>
                {renderSpeciesList(species)}
              </div>
            );
          })}
        </div>
      ) : (
        renderSpeciesList(filteredSpecies)
      )}

      {filteredSpecies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Nenhuma espécie encontrada com os filtros atuais.
          </p>
        </div>
      )}
    </div>
  );
};
