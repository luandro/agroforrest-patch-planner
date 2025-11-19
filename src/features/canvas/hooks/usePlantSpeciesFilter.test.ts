import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlantSpeciesFilter } from './usePlantSpeciesFilter';

describe('usePlantSpeciesFilter', () => {
  describe('filtering by search term', () => {
    it('should return all species when search term is empty', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'all',
        selectedCompatibility: 'all'
      }));

      expect(result.current.filteredSpecies.length).toBeGreaterThan(0);
    });

    it('should filter by common name (case insensitive)', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: 'manga',
        selectedCategory: 'all',
        selectedCompatibility: 'all'
      }));

      const hasMatch = result.current.filteredSpecies.some(
        s => s.commonName.toLowerCase().includes('manga')
      );
      expect(hasMatch).toBe(true);

      // All results should match the search term
      result.current.filteredSpecies.forEach(species => {
        const matchesCommon = species.commonName.toLowerCase().includes('manga');
        const matchesScientific = species.scientificName.toLowerCase().includes('manga');
        expect(matchesCommon || matchesScientific).toBe(true);
      });
    });

    it('should filter by scientific name', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: 'persea',
        selectedCategory: 'all',
        selectedCompatibility: 'all'
      }));

      const hasMatch = result.current.filteredSpecies.some(
        s => s.scientificName.toLowerCase().includes('persea')
      );
      expect(hasMatch).toBe(true);
    });

    it('should return empty array when no matches found', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: 'xyz123nonexistent',
        selectedCategory: 'all',
        selectedCompatibility: 'all'
      }));

      expect(result.current.filteredSpecies).toHaveLength(0);
    });
  });

  describe('filtering by category', () => {
    it('should return only trees when category is trees', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'trees',
        selectedCompatibility: 'all'
      }));

      expect(result.current.filteredSpecies.length).toBeGreaterThan(0);
      result.current.filteredSpecies.forEach(species => {
        expect(species.category).toBe('trees');
      });
    });

    it('should return only shrubs when category is shrubs', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'shrubs',
        selectedCompatibility: 'all'
      }));

      expect(result.current.filteredSpecies.length).toBeGreaterThan(0);
      result.current.filteredSpecies.forEach(species => {
        expect(species.category).toBe('shrubs');
      });
    });

    it('should return only herbs when category is herbs', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'herbs',
        selectedCompatibility: 'all'
      }));

      expect(result.current.filteredSpecies.length).toBeGreaterThan(0);
      result.current.filteredSpecies.forEach(species => {
        expect(species.category).toBe('herbs');
      });
    });

    it('should return only ground-cover when category is ground-cover', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'ground-cover',
        selectedCompatibility: 'all'
      }));

      expect(result.current.filteredSpecies.length).toBeGreaterThan(0);
      result.current.filteredSpecies.forEach(species => {
        expect(species.category).toBe('ground-cover');
      });
    });
  });

  describe('filtering by compatibility', () => {
    it('should return only high compatibility when selected', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'all',
        selectedCompatibility: 'high'
      }));

      expect(result.current.filteredSpecies.length).toBeGreaterThan(0);
      result.current.filteredSpecies.forEach(species => {
        expect(species.companionCompatibility).toBe('high');
      });
    });

    it('should return only medium compatibility when selected', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'all',
        selectedCompatibility: 'medium'
      }));

      result.current.filteredSpecies.forEach(species => {
        expect(species.companionCompatibility).toBe('medium');
      });
    });

    it('should return only low compatibility when selected', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'all',
        selectedCompatibility: 'low'
      }));

      result.current.filteredSpecies.forEach(species => {
        expect(species.companionCompatibility).toBe('low');
      });
    });
  });

  describe('combined filters', () => {
    it('should apply all filters together', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: 'a',
        selectedCategory: 'trees',
        selectedCompatibility: 'high'
      }));

      result.current.filteredSpecies.forEach(species => {
        expect(species.category).toBe('trees');
        expect(species.companionCompatibility).toBe('high');
        const matchesSearch =
          species.commonName.toLowerCase().includes('a') ||
          species.scientificName.toLowerCase().includes('a');
        expect(matchesSearch).toBe(true);
      });
    });
  });

  describe('speciesByCategory', () => {
    it('should categorize filtered species correctly', () => {
      const { result } = renderHook(() => usePlantSpeciesFilter({
        searchTerm: '',
        selectedCategory: 'all',
        selectedCompatibility: 'all'
      }));

      const { speciesByCategory } = result.current;

      // Should have all categories
      expect(speciesByCategory).toHaveProperty('trees');
      expect(speciesByCategory).toHaveProperty('shrubs');
      expect(speciesByCategory).toHaveProperty('ground-cover');
      expect(speciesByCategory).toHaveProperty('herbs');

      // Each category array should only contain species of that category
      speciesByCategory.trees.forEach(s => expect(s.category).toBe('trees'));
      speciesByCategory.shrubs.forEach(s => expect(s.category).toBe('shrubs'));
      speciesByCategory['ground-cover'].forEach(s => expect(s.category).toBe('ground-cover'));
      speciesByCategory.herbs.forEach(s => expect(s.category).toBe('herbs'));
    });

    it('should update categories when filter changes', () => {
      const { result, rerender } = renderHook(
        (props) => usePlantSpeciesFilter(props),
        {
          initialProps: {
            searchTerm: '',
            selectedCategory: 'all' as const,
            selectedCompatibility: 'all' as const
          }
        }
      );

      const initialTreeCount = result.current.speciesByCategory.trees.length;

      // Filter to only trees
      rerender({
        searchTerm: '',
        selectedCategory: 'trees',
        selectedCompatibility: 'all'
      });

      // Trees should still have same count
      expect(result.current.speciesByCategory.trees.length).toBe(initialTreeCount);
      // Other categories should be empty
      expect(result.current.speciesByCategory.shrubs).toHaveLength(0);
      expect(result.current.speciesByCategory.herbs).toHaveLength(0);
      expect(result.current.speciesByCategory['ground-cover']).toHaveLength(0);
    });
  });

  describe('memoization', () => {
    it('should return same reference when props unchanged', () => {
      const props = {
        searchTerm: '',
        selectedCategory: 'all' as const,
        selectedCompatibility: 'all' as const
      };

      const { result, rerender } = renderHook(() => usePlantSpeciesFilter(props));

      const firstResult = result.current.filteredSpecies;
      rerender();
      const secondResult = result.current.filteredSpecies;

      expect(firstResult).toBe(secondResult);
    });
  });
});
