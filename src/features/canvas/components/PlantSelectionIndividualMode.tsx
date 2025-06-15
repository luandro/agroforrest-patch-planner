
import React from 'react';
import { PlantSpecies, PlantCategory } from '../types/species.types';
import { PlantSelectionSearch } from './PlantSelectionSearch';
import { PlantSelectionResults } from './PlantSelectionResults';
import { PlantSelectionContent } from './PlantSelectionContent';
import { PlantSelectionHelpText } from './PlantSelectionHelpText';

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
