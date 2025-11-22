
import React from 'react';
import { PlantSpecies, PlantCategory, CompatibilityLevel } from '../types/species.types';
import { PlantSelectionSearch } from './PlantSelectionSearch';
import { PlantSelectionResults } from './PlantSelectionResults';
import { PlantSelectionContent } from './PlantSelectionContent';
import { PlantSelectionHelpText } from './PlantSelectionHelpText';
import { Card, CardContent } from '@/components/ui/card';
import { Grid3X3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface PlantSelectionIndividualModeProps {
  searchTerm: string;
  onSearchChange?: (value: string) => void;
  selectedCategory: PlantCategory | 'all';
  onCategoryChange: (category: PlantCategory | 'all') => void;
  selectedCompatibility: CompatibilityLevel | 'all';
  onCompatibilityChange: (compatibility: CompatibilityLevel | 'all') => void;
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
  const isMobile = useIsMobile();

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

      {/* Bulk placement hint when available - more compact on mobile */}
      {showBulkButton && (
        <div className={cn("flex-shrink-0", isMobile ? "px-2 py-1" : "px-4 pb-2")}>
          <Card className="border-green-200 bg-green-50">
            <CardContent className={cn(isMobile ? "p-2" : "p-3")}>
              <div className={cn(
                "flex items-center gap-2 text-green-700",
                isMobile ? "text-xs" : "text-sm"
              )}>
                <Grid3X3 className={cn("flex-shrink-0", isMobile ? "w-3 h-3" : "w-4 h-4")} />
                <span className="leading-tight">
                  {isMobile ? "Botão verde para plantio em massa" : "Clique no botão verde para plantio em massa"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Species list - this gets all remaining space */}
      <div className="flex-1 min-h-0">
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
      </div>

      {/* Help text - hide on mobile to save space */}
      {!isMobile && <PlantSelectionHelpText />}
    </>
  );
};
