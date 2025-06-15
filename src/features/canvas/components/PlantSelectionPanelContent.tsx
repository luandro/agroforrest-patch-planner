import React, { useState, useMemo } from 'react';
import { PlantSpecies, PlantCategory, CompatibilityLevel } from '../types/species.types';
import { mockPlantSpecies } from '../data/mockSpecies';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBulkPlacement } from '../hooks/useBulkPlacement';
import { PlantSelectionTabs } from './PlantSelectionTabs';
import { PlantSelectionIndividualMode } from './PlantSelectionIndividualMode';
import { PlantSelectionBulkMode } from './PlantSelectionBulkMode';

interface PlantSelectionPanelContentProps {
  onSelectSpecies: (species: PlantSpecies) => void;
}

export const PlantSelectionPanelContent: React.FC<PlantSelectionPanelContentProps> = ({
  onSelectSpecies
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all');
  const [selectedCompatibility, setSelectedCompatibility] = useState<CompatibilityLevel | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'bulk'>('individual');

  const { selectedSpecies, isPlacing } = usePlantPlacementStore();
  const { isActive: isBulkActive, initializeBulkPlacement } = useBulkPlacement();

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
    if (activeTab === 'bulk') {
      initializeBulkPlacement(species);
    } else {
      // Direct selection - immediately enters placement mode
      onSelectSpecies(species);
    }
    // Keep panel open for easy species switching
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCompatibility('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedCompatibility !== 'all' || searchTerm !== '';

  // Auto-switch to bulk tab when bulk placement is active
  React.useEffect(() => {
    if (isBulkActive) {
      setActiveTab('bulk');
    }
  }, [isBulkActive]);

  return (
    <>
      {/* Mode Tabs */}
      <PlantSelectionTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'bulk' && isBulkActive ? (
        /* Bulk Placement Mode */
        <PlantSelectionBulkMode isBulkActive={isBulkActive} />
      ) : (
        /* Individual Placement Mode */
        <PlantSelectionIndividualMode
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
          filteredSpecies={filteredSpecies}
          speciesByCategory={speciesByCategory}
          selectedSpecies={selectedSpecies}
          isPlacing={isPlacing}
          onSelectSpecies={handleSpeciesSelect}
          onBulkSelect={(species) => {
            setActiveTab('bulk');
            initializeBulkPlacement(species);
          }}
        />
      )}
    </>
  );
};
