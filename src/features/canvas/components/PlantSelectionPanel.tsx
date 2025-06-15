
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PlantSpecies, PlantCategory, CompatibilityLevel } from '../types/species.types';
import { mockPlantSpecies } from '../data/mockSpecies';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { PlantSelectionHeader } from './PlantSelectionHeader';
import { PlantSelectionSearch } from './PlantSelectionSearch';
import { PlantSelectionResults } from './PlantSelectionResults';
import { PlantSelectionContent } from './PlantSelectionContent';
import { PlantSelectionHelpText } from './PlantSelectionHelpText';

interface PlantSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpecies: (species: PlantSpecies) => void;
  selectedBedId?: string;
}

export const PlantSelectionPanel: React.FC<PlantSelectionPanelProps> = ({
  isOpen,
  onClose,
  onSelectSpecies,
  selectedBedId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all');
  const [selectedCompatibility, setSelectedCompatibility] = useState<CompatibilityLevel | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { selectedSpecies, isPlacing } = usePlantPlacementStore();

  const filteredSpecies = useMemo(() => {
    return mockPlantSpecies.filter(species => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        species.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || species.category === selectedCategory;

      // Compatibility filter
      const matchesCompatibility = selectedCompatibility === 'all' || 
        species.companionCompatibility === selectedCompatibility;

      return matchesSearch && matchesCategory && matchesCompatibility;
    });
  }, [searchTerm, selectedCategory, selectedCompatibility]);

  const speciesByCategory = useMemo(() => {
    const categories: Record<PlantCategory, PlantSpecies[]> = {
      'trees': [],
      'shrubs': [],
      'ground-cover': [],
      'herbs': []
    };

    filteredSpecies.forEach(species => {
      categories[species.category].push(species);
    });

    return categories;
  }, [filteredSpecies]);

  const handleSpeciesSelect = (species: PlantSpecies) => {
    // Direct selection - immediately enters placement mode
    onSelectSpecies(species);
    // Keep panel open for easy species switching
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCompatibility('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedCompatibility !== 'all' || searchTerm !== '';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={cn(
        "fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 bg-white/95 backdrop-blur-sm shadow-xl border-l border-gray-200 z-50",
        "flex flex-col",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <PlantSelectionHeader
          onClose={onClose}
          isPlacing={isPlacing}
          selectedSpecies={selectedSpecies}
          selectedBedId={selectedBedId}
        />

        <PlantSelectionSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCompatibility={selectedCompatibility}
          onCompatibilityChange={setSelectedCompatibility}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <PlantSelectionResults count={filteredSpecies.length} />

        <PlantSelectionContent
          filteredSpecies={filteredSpecies}
          speciesByCategory={speciesByCategory}
          selectedCategory={selectedCategory}
          selectedSpecies={selectedSpecies}
          isPlacing={isPlacing}
          onSelectSpecies={handleSpeciesSelect}
        />

        <PlantSelectionHelpText />
      </div>
    </>
  );
};
