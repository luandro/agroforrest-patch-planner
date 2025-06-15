
import React from 'react';
import { PlantSpecies, PlantCategory } from '../types/species.types';
import { PlantSelectionSearch } from './PlantSelectionSearch';
import { PlantSelectionResults } from './PlantSelectionResults';
import { PlantSelectionContent } from './PlantSelectionContent';
import { PlantSelectionHelpText } from './PlantSelectionHelpText';
import { Card, CardContent } from '@/components/ui/card';
import { Grid3X3, Info } from 'lucide-react';

interface PlantSelectionIndividualModeProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: PlantCategory | 'all';
  onCategoryChange: (category: PlantCategory | 'all') => void;
  selectedCompatibility: any;
  onCompatibilityChange: (compatibility: any) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  filteredSpecies: PlantSpecies[];
  speciesByCategory: Record<PlantCategory, PlantSpecies[]>;
  selectedSpecies: PlantSpecies | null;
  isPlacing: boolean;
  onSelectSpecies: (species: PlantSpecies) => void;
  onBulkSelect: (species: PlantSpecies) => void;
  showBulkButton?: boolean;
}

export const PlantSelectionIndividualMode: React.FC<PlantSelectionIndividualModeProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCompatibility,
  onCompatibilityChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters,
  filteredSpecies,
  speciesByCategory,
  selectedSpecies,
  isPlacing,
  onSelectSpecies,
  onBulkSelect,
  showBulkButton = false
}) => {
  return (
    <>
      <PlantSelectionSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        selectedCompatibility={selectedCompatibility}
        onCompatibilityChange={onCompatibilityChange}
        showFilters={showFilters}
        onToggleFilters={onToggleFilters}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <PlantSelectionResults count={filteredSpecies.length} />

      {/* Bulk placement hint when available */}
      {showBulkButton && (
        <div className="px-4 pb-2">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Grid3X3 className="w-4 h-4 flex-shrink-0" />
                <span>Clique no botão verde <Grid3X3 className="w-3 h-3 inline mx-1" /> para plantio em massa</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <PlantSelectionContent
        filteredSpecies={filteredSpecies}
        speciesByCategory={speciesByCategory}
        selectedCategory={selectedCategory}
        selectedSpecies={selectedSpecies}
        isPlacing={isPlacing}
        onSelectSpecies={onSelectSpecies}
        showBulkButton={showBulkButton}
        onBulkSelect={onBulkSelect}
      />

      <PlantSelectionHelpText />
    </>
  );
};
