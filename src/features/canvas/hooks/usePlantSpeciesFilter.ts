
import { useMemo } from 'react';
import { PlantSpecies, PlantCategory, CompatibilityLevel } from '../types/species.types';
import { mockSpecies } from '../data/mockSpecies';

interface UsePlantSpeciesFilterProps {
  searchTerm: string;
  selectedCategory: PlantCategory | 'all';
  selectedCompatibility: CompatibilityLevel | 'all';
}

interface UsePlantSpeciesFilterReturn {
  filteredSpecies: PlantSpecies[];
  speciesByCategory: Record<PlantCategory, PlantSpecies[]>;
}

/**
 * Hook to filter and categorize plant species based on search criteria
 */
export function usePlantSpeciesFilter({
  searchTerm,
  selectedCategory,
  selectedCompatibility
}: UsePlantSpeciesFilterProps): UsePlantSpeciesFilterReturn {
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

  return {
    filteredSpecies,
    speciesByCategory
  };
}
