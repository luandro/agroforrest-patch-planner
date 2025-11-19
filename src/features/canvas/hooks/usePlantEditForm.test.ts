import { describe, it, expect } from 'vitest';
import { getCategoryBadgeColor } from './usePlantEditForm';

// Note: Full hook tests with Zustand stores require additional setup
// See: https://docs.pmnd.rs/zustand/guides/testing

describe('getCategoryBadgeColor', () => {
  it('should return correct color for trees', () => {
    expect(getCategoryBadgeColor('trees')).toBe('bg-green-700 text-white');
  });

  it('should return correct color for shrubs', () => {
    expect(getCategoryBadgeColor('shrubs')).toBe('bg-green-500 text-white');
  });

  it('should return correct color for ground-cover', () => {
    expect(getCategoryBadgeColor('ground-cover')).toBe('bg-green-300 text-green-800');
  });

  it('should return correct color for herbs', () => {
    expect(getCategoryBadgeColor('herbs')).toBe('bg-green-200 text-green-800');
  });

  it('should return default color for unknown category', () => {
    expect(getCategoryBadgeColor('unknown')).toBe('bg-gray-200 text-gray-800');
  });
});
