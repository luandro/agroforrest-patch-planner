
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlantCategory, CompatibilityLevel } from '../types/species.types';
import { PlantCategoryFilter } from './PlantCategoryFilter';
import { PlantCompatibilityFilter } from './PlantCompatibilityFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "border-b border-gray-200 bg-white flex-shrink-0",
      isMobile ? "p-2" : "p-4"
    )}>
      {/* Mobile: Collapsible header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="flex items-center gap-1 p-1 h-auto text-xs text-gray-600"
          >
            <Search className="w-3 h-3" />
            Busca e Filtros
            {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs p-1 h-auto text-red-600"
            >
              Limpar
            </Button>
          )}
        </div>
      )}

      {/* Search and filters - collapsible on mobile */}
      {(!isMobile || !isCollapsed) && (
        <div className={cn("space-y-2", isMobile ? "space-y-2" : "space-y-3")}>
          {/* Search */}
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
              isMobile ? "w-3 h-3" : "w-4 h-4"
            )} />
            <Input
              placeholder="Buscar espécie..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                isMobile ? "pl-8 h-8 text-sm" : "pl-10"
              )}
            />
          </div>

          {/* Filter Toggle - Desktop only */}
          {!isMobile && (
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
          )}

          {/* Filters - always show on mobile when expanded, conditional on desktop */}
          {(isMobile || showFilters) && (
            <div className={cn(
              "space-y-2 pt-2 border-t border-gray-100",
              isMobile ? "space-y-2" : "space-y-3"
            )}>
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
      )}
    </div>
  );
};
