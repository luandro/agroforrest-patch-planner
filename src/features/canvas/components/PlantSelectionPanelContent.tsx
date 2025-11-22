
import React, { useState, useCallback } from 'react';
import { PlantSpecies, PlantCategory, CompatibilityLevel } from '../types/species.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { usePlantSpeciesFilter } from '../hooks/usePlantSpeciesFilter';
import { useTemplateApplication } from '../hooks/useTemplateApplication';
import { PlantSelectionTabs } from './PlantSelectionTabs';
import { PlantSelectionIndividualMode } from './PlantSelectionIndividualMode';
import { PlantSelectionBulkMode } from './PlantSelectionBulkMode';
import { PlantingTemplatesSection } from './PlantingTemplatesSection';
import { BulkPlacementManager, inactiveBulkPlacementState } from './BulkPlacementManager';
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';

interface PlantSelectionPanelContentProps {
  onSelectSpecies: (species: PlantSpecies) => void;
  searchQuery?: string;
}

export const PlantSelectionPanelContent: React.FC<PlantSelectionPanelContentProps> = ({
  onSelectSpecies,
  searchQuery: externalSearchQuery
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Use external search query if provided, otherwise use internal state
  const effectiveSearchTerm = externalSearchQuery !== undefined ? externalSearchQuery : searchTerm;
  const [selectedCategory, setSelectedCategory] = useState<PlantCategory | 'all'>('all');
  const [selectedCompatibility, setSelectedCompatibility] = useState<CompatibilityLevel | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'bulk'>('individual');
  const [speciesForBulk, setSpeciesForBulk] = useState<PlantSpecies | null>(null);

  const { selectedSpecies, isPlacing } = usePlantPlacementStore();
  const { focusMode, beds } = useBedStore();
  const cancelBulkPlacementAction = useBulkPlacementStore(state => state.cancelBulkPlacement);

  const showBulkButton = focusMode.isActive;
  const focusedBed = focusMode.isActive ? beds.find(bed => bed.id === focusMode.bedId) : null;

  // Use extracted hooks
  const { filteredSpecies, speciesByCategory } = usePlantSpeciesFilter({
    searchTerm: effectiveSearchTerm,
    selectedCategory,
    selectedCompatibility
  });

  const { handleApplyTemplate } = useTemplateApplication({ focusedBed: focusedBed || null });

  const handleSpeciesSelect = (species: PlantSpecies) => {
    onSelectSpecies(species);
  };

  const clearFilters = () => {
    if (externalSearchQuery === undefined) {
      setSearchTerm('');
    }
    setSelectedCategory('all');
    setSelectedCompatibility('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedCompatibility !== 'all' || effectiveSearchTerm !== '';

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
        <div className="flex-1 overflow-y-auto space-y-4 p-3">
          {/* Templates Section - Show prominently when in focus mode */}
          {focusMode.isActive && (
            <>
              <PlantingTemplatesSection
                onApplyTemplate={handleApplyTemplate}
                compact={false}
              />

              {/* Divider */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🌱</span>
                  <h3 className="font-semibold text-gray-900">Espécies Individuais</h3>
                </div>
              </div>
            </>
          )}

          <PlantSelectionIndividualMode
            searchTerm={effectiveSearchTerm}
            onSearchChange={externalSearchQuery === undefined ? setSearchTerm : undefined}
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
        </div>
      ) : speciesForBulk ? (
        <BulkPlacementManager
          speciesForBulk={speciesForBulk}
          onCancel={handleCancelBulkPlacement}
        />
      ) : (
        <PlantSelectionBulkMode bulkPlacementProps={inactiveBulkPlacementState} />
      )}
    </div>
  );
};
