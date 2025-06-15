
import React, { useState, useMemo } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PlantSpecies, PlantCategory, CompatibilityLevel, PlantFilter } from '../types/species.types';
import { mockPlantSpecies } from '../data/mockSpecies';
import { PlantSpeciesCard } from './PlantSpeciesCard';
import { PlantCategoryFilter } from './PlantCategoryFilter';
import { PlantCompatibilityFilter } from './PlantCompatibilityFilter';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

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

  const { setSelectedSpecies } = usePlantPlacementStore();

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

  const categoryLabels: Record<PlantCategory, string> = {
    'trees': 'Árvores',
    'shrubs': 'Arbustos',
    'ground-cover': 'Cobertura de Solo',
    'herbs': 'Ervas'
  };

  const handleSpeciesSelect = (species: PlantSpecies) => {
    // Set the species for placement mode
    setSelectedSpecies(species);
    onSelectSpecies(species);
    // Close panel when selecting for placement
    onClose();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCompatibility('all');
  };

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
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Selecionar Plantas
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {selectedBedId && (
            <p className="text-sm text-gray-600 mt-1">
              Selecione uma espécie para plantar no canteiro
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <div className="p-4 space-y-3 border-b border-gray-200">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome comum ou científico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>

            {(selectedCategory !== 'all' || selectedCompatibility !== 'all' || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Limpar
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <PlantCategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
              <PlantCompatibilityFilter
                selected={selectedCompatibility}
                onSelect={setSelectedCompatibility}
              />
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50">
          {filteredSpecies.length} espécie{filteredSpecies.length !== 1 ? 's' : ''} encontrada{filteredSpecies.length !== 1 ? 's' : ''}
        </div>

        {/* Species List */}
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
                          onSelect={() => handleSpeciesSelect(speciesItem)}
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
                    onSelect={() => handleSpeciesSelect(species)}
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
      </div>
    </>
  );
};
