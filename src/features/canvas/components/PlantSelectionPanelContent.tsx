
import React, { useState, useMemo, useCallback } from 'react';
import { PlantSpecies, PlantCategory, CompatibilityLevel } from '../types/species.types';
import { mockSpecies } from '../data/mockSpecies';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { useBulkPlacement } from '../hooks/useBulkPlacement';
import { PlantSelectionTabs } from './PlantSelectionTabs';
import { PlantSelectionIndividualMode } from './PlantSelectionIndividualMode';
import { PlantSelectionBulkMode } from './PlantSelectionBulkMode';
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';

interface PlantSelectionPanelContentProps {
  onSelectSpecies: (species: PlantSpecies) => void;
}

const BulkPlacementManager: React.FC<{
  speciesForBulk: PlantSpecies;
  onCancel: () => void;
}> = ({ speciesForBulk, onCancel }) => {
  const bulkPlacement = useBulkPlacement();
  const { initializeBulkPlacement, isActive } = bulkPlacement;

  // Initialize on mount
  React.useEffect(() => {
    initializeBulkPlacement(speciesForBulk);
  }, [speciesForBulk, initializeBulkPlacement]);

  const wasActiveRef = React.useRef(isActive);
  React.useEffect(() => {
    // When bulk placement is finished/cancelled, it becomes inactive.
    // We then trigger the onCancel callback to switch back to the individual tab.
    if (wasActiveRef.current && !isActive) {
      const timer = setTimeout(() => {
        onCancel();
      }, 0);
      return () => clearTimeout(timer);
    }
    wasActiveRef.current = isActive;
  }, [isActive, onCancel]);

  return <PlantSelectionBulkMode bulkPlacementProps={bulkPlacement} />;
};


export const PlantSelectionPanelContent: React.FC<PlantSelectionPanelContentProps> = ({
  onSelectSpecies
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all');
  const [selectedCompatibility, setSelectedCompatibility] = useState<CompatibilityLevel | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'bulk'>('individual');
  const [speciesForBulk, setSpeciesForBulk] = useState<PlantSpecies | null>(null);

  const { selectedSpecies, isPlacing } = usePlantPlacementStore();
  const { focusMode } = useBedStore();
  const cancelBulkPlacementAction = useBulkPlacementStore(state => state.cancelBulkPlacement);

  const showBulkButton = focusMode.isActive;

  const filteredSpecies = useMemo(() => {
    return mockSpecies.filter(species => {
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
    onSelectSpecies(species);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCompatibility('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedCompatibility !== 'all' || searchTerm !== '';

  const handleStartBulkPlacement = useCallback((species: PlantSpecies) => {
    setSpeciesForBulk(species);
    setActiveTab('bulk');
  }, []);

  const handleCancelBulkPlacement = useCallback(() => {
    setSpeciesForBulk(null);
    setActiveTab('individual');
  }, []);

  const handleTabChange = useCallback((tab: 'individual' | 'bulk') => {
    if (tab === 'individual' && activeTab === 'bulk') {
      // If user manually clicks "Individual" tab, cancel bulk placement.
      cancelBulkPlacementAction();
      handleCancelBulkPlacement();
    } else {
      setActiveTab(tab);
    }
  }, [activeTab, handleCancelBulkPlacement, cancelBulkPlacementAction]);


  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PlantSelectionTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {activeTab === 'individual' ? (
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
          onBulkSelect={handleStartBulkPlacement}
          showBulkButton={showBulkButton}
        />
      ) : speciesForBulk ? (
        <BulkPlacementManager 
          speciesForBulk={speciesForBulk}
          onCancel={handleCancelBulkPlacement}
        />
      ) : (
        <PlantSelectionBulkMode bulkPlacementProps={{ isActive: false } as any} />
      )}
    </div>
  );
};
