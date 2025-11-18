
import React, { useState, useMemo, useCallback } from 'react';
import { PlantSpecies, PlantCategory, CompatibilityLevel } from '../types/species.types';
import { PlantingTemplate } from '../types/template.types';
import { mockSpecies } from '../data/mockSpecies';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { useBulkPlacement } from '../hooks/useBulkPlacement';
import { PlantSelectionTabs } from './PlantSelectionTabs';
import { PlantSelectionIndividualMode } from './PlantSelectionIndividualMode';
import { PlantSelectionBulkMode } from './PlantSelectionBulkMode';
import { PlantingTemplatesSection } from './PlantingTemplatesSection';
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';
import { scaleTemplateToFit } from '../utils/templateUtils';

interface PlantSelectionPanelContentProps {
  onSelectSpecies: (species: PlantSpecies) => void;
}

type BulkPlacementHookReturn = ReturnType<typeof useBulkPlacement>;

const inactiveBulkPlacementState: BulkPlacementHookReturn = {
  isActive: false,
  selectedSpecies: null,
  selectedBed: null,
  config: null,
  preview: null,
  showPreview: false,
  isCalculating: false,
  initializeBulkPlacement: () => undefined,
  updateConfig: () => undefined,
  executeBulkPlacement: () => false,
  cancelBulkPlacement: () => undefined,
  setShowPreview: () => undefined,
  canExecute: false,
  hasConflicts: false
};

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

  const { selectedSpecies, isPlacing, addPlacement } = usePlantPlacementStore();
  const { focusMode, beds } = useBedStore();
  const cancelBulkPlacementAction = useBulkPlacementStore(state => state.cancelBulkPlacement);

  const showBulkButton = focusMode.isActive;
  const focusedBed = focusMode.isActive ? beds.find(bed => bed.id === focusMode.bedId) : null;

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

  // Handle template application
  const handleApplyTemplate = useCallback((template: PlantingTemplate) => {
    if (!focusedBed) {
      console.error('No focused bed available for template placement');
      return;
    }

    console.log('Applying template:', template.name);
    
    // Generate scaled template
    const scaledPlants = scaleTemplateToFit(template, focusedBed, true);
    
    // Add each plant from the template
    scaledPlants.forEach(templatePlant => {
      if (!templatePlant.species) {
        console.warn('Species not found for template plant:', templatePlant.speciesId);
        return;
      }

      // Convert template plant to our species format
      const species: PlantSpecies = {
        id: templatePlant.species.id,
        commonName: templatePlant.species.commonName,
        scientificName: templatePlant.species.scientificName,
        category: templatePlant.species.category,
        companionCompatibility: 'high', // Templates should have good compatibility
        matureSize: { height: 2, width: 1 }, // Default values
        spacing: { min: 0.3, max: 1.0 },
        growthRate: 'medium',
        sunRequirement: 'partial',
        waterRequirement: 'medium'
      };

      // Add multiple placements for quantity > 1
      for (let i = 0; i < templatePlant.quantity; i++) {
        const offsetX = i * 0.1; // Small offset for multiple plants
        const offsetY = i * 0.1;
        
        addPlacement({
          bedId: focusedBed.id,
          species: species,
          position: {
            x: templatePlant.scaledPosition.x + offsetX,
            y: templatePlant.scaledPosition.y + offsetY
          },
          notes: `Modelo: ${template.name}${templatePlant.notes ? ` - ${templatePlant.notes}` : ''}`
        });
      }
    });

    console.log(`Template '${template.name}' applied with ${scaledPlants.length} plant types`);
  }, [focusedBed, addPlacement]);

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
