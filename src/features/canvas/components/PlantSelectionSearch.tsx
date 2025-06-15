
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlantCategory, CompatibilityLevel } from '../types/species.types';
import { PlantCategoryFilter } from './PlantCategoryFilter';
import { PlantCompatibilityFilter } from './PlantCompatibilityFilter';

interface PlantSelectionSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: PlantCategory | 'all';
  onCategoryChange: (category: PlantCategory | 'all') => void;
  selectedCompatibility: CompatibilityLevel | 'all';
  onCompatibilityChange: (compatibility: CompatibilityLevel | 'all') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const PlantSelectionSearch: React.FC<PlantSelectionSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCompatibility,
  onCompatibilityChange,
  showFilters,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="p-4 space-y-3 border-b border-gray-200">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome comum ou científico..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
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
            onSelect={onCategoryChange}
          />
          <PlantCompatibilityFilter
            selected={selectedCompatibility}
            onSelect={onCompatibilityChange}
          />
        </div>
      )}
    </div>
  );
};
