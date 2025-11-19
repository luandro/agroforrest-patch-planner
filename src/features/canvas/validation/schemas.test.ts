import { describe, it, expect } from 'vitest';
import {
  PatchSchema,
  BedSchema,
  PlantPlacementSchema,
  PlantSpeciesSchema,
  validatePatches,
  validateBeds,
  validatePlacements,
  validatePatch,
  validateBed,
  validatePlacement,
} from './schemas';

describe('validation schemas', () => {
  // ==========================================================================
  // Test Data Factories
  // ==========================================================================

  const createValidPatch = (overrides = {}) => ({
    id: 'patch-1',
    name: 'Test Patch',
    size: { width: 100, height: 50 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  });

  const createValidBed = (overrides = {}) => ({
    id: 'bed-1',
    shape: 'rectangle' as const,
    position: { x: 10, y: 20 },
    dimensions: { length: 5, width: 2 },
    rotation: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  });

  const createValidSpecies = (overrides = {}) => ({
    id: 'species-1',
    commonName: 'Apple Tree',
    scientificName: 'Malus domestica',
    category: 'trees' as const,
    companionCompatibility: 'high' as const,
    matureSize: { height: 5, width: 4 },
    spacing: { min: 3, max: 5 },
    growthRate: 'medium' as const,
    sunRequirement: 'full' as const,
    waterRequirement: 'medium' as const,
    ...overrides,
  });

  const createValidPlacement = (overrides = {}) => ({
    id: 'placement-1',
    bedId: 'bed-1',
    species: createValidSpecies(),
    position: { x: 5, y: 10 },
    ...overrides,
  });

  // ==========================================================================
  // Patch Schema Tests
  // ==========================================================================

  describe('PatchSchema', () => {
    it('should validate a valid patch', () => {
      const patch = createValidPatch();
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(true);
    });

    it('should validate patch with optional fields', () => {
      const patch = createValidPatch({
        description: 'A test patch',
        location: 'Backyard',
        lastViewport: { zoom: 1.5, centerX: 50, centerY: 25 },
        isActive: true,
      });
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(true);
    });

    it('should reject patch with empty name', () => {
      const patch = createValidPatch({ name: '' });
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(false);
    });

    it('should reject patch with name too long', () => {
      const patch = createValidPatch({ name: 'a'.repeat(101) });
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(false);
    });

    it('should reject patch with negative dimensions', () => {
      const patch = createValidPatch({ size: { width: -10, height: 50 } });
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(false);
    });

    it('should reject patch with zero width', () => {
      const patch = createValidPatch({ size: { width: 0, height: 50 } });
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(false);
    });

    it('should reject patch with dimensions too large', () => {
      const patch = createValidPatch({ size: { width: 20000, height: 50 } });
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(false);
    });

    it('should reject patch with missing id', () => {
      const { id, ...patch } = createValidPatch();
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(false);
    });

    it('should reject patch with invalid timestamps', () => {
      const patch = createValidPatch({ createdAt: -1 });
      const result = PatchSchema.safeParse(patch);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // Bed Schema Tests
  // ==========================================================================

  describe('BedSchema', () => {
    it('should validate a valid rectangle bed', () => {
      const bed = createValidBed();
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(true);
    });

    it('should validate a valid circle bed', () => {
      const bed = createValidBed({
        shape: 'circle',
        dimensions: { radius: 3 },
      });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(true);
    });

    it('should validate bed with optional patchId', () => {
      const bed = createValidBed({ patchId: 'patch-1' });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(true);
    });

    it('should reject rectangle bed without length', () => {
      const bed = createValidBed({
        dimensions: { width: 2 },
      });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(false);
    });

    it('should reject rectangle bed without width', () => {
      const bed = createValidBed({
        dimensions: { length: 5 },
      });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(false);
    });

    it('should reject circle bed without radius', () => {
      const bed = createValidBed({
        shape: 'circle',
        dimensions: { length: 5, width: 2 },
      });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(false);
    });

    it('should reject bed with invalid shape', () => {
      const bed = createValidBed({ shape: 'triangle' });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(false);
    });

    it('should reject bed with negative dimensions', () => {
      const bed = createValidBed({
        dimensions: { length: -5, width: 2 },
      });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(false);
    });

    it('should reject bed with rotation out of range', () => {
      const bed = createValidBed({ rotation: 500 });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(false);
    });

    it('should accept negative rotation within range', () => {
      const bed = createValidBed({ rotation: -45 });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(true);
    });

    it('should reject bed with dimensions too large', () => {
      const bed = createValidBed({
        dimensions: { length: 150, width: 2 },
      });
      const result = BedSchema.safeParse(bed);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // Plant Species Schema Tests
  // ==========================================================================

  describe('PlantSpeciesSchema', () => {
    it('should validate a valid species', () => {
      const species = createValidSpecies();
      const result = PlantSpeciesSchema.safeParse(species);
      expect(result.success).toBe(true);
    });

    it('should validate species with optional fields', () => {
      const species = createValidSpecies({
        image: 'apple.png',
        description: 'A common fruit tree',
        isEdible: true,
      });
      const result = PlantSpeciesSchema.safeParse(species);
      expect(result.success).toBe(true);
    });

    it('should reject species with empty common name', () => {
      const species = createValidSpecies({ commonName: '' });
      const result = PlantSpeciesSchema.safeParse(species);
      expect(result.success).toBe(false);
    });

    it('should reject species with invalid category', () => {
      const species = createValidSpecies({ category: 'vegetables' });
      const result = PlantSpeciesSchema.safeParse(species);
      expect(result.success).toBe(false);
    });

    it('should reject species with min spacing greater than max', () => {
      const species = createValidSpecies({
        spacing: { min: 10, max: 5 },
      });
      const result = PlantSpeciesSchema.safeParse(species);
      expect(result.success).toBe(false);
    });

    it('should reject species with negative mature size', () => {
      const species = createValidSpecies({
        matureSize: { height: -2, width: 4 },
      });
      const result = PlantSpeciesSchema.safeParse(species);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // Plant Placement Schema Tests
  // ==========================================================================

  describe('PlantPlacementSchema', () => {
    it('should validate a valid placement', () => {
      const placement = createValidPlacement();
      const result = PlantPlacementSchema.safeParse(placement);
      expect(result.success).toBe(true);
    });

    it('should validate placement with optional fields', () => {
      const placement = createValidPlacement({
        patchId: 'patch-1',
        notes: 'Planted in spring',
      });
      const result = PlantPlacementSchema.safeParse(placement);
      expect(result.success).toBe(true);
    });

    it('should reject placement with empty id', () => {
      const placement = createValidPlacement({ id: '' });
      const result = PlantPlacementSchema.safeParse(placement);
      expect(result.success).toBe(false);
    });

    it('should reject placement with empty bedId', () => {
      const placement = createValidPlacement({ bedId: '' });
      const result = PlantPlacementSchema.safeParse(placement);
      expect(result.success).toBe(false);
    });

    it('should reject placement with invalid species', () => {
      const placement = createValidPlacement({
        species: { ...createValidSpecies(), commonName: '' },
      });
      const result = PlantPlacementSchema.safeParse(placement);
      expect(result.success).toBe(false);
    });

    it('should reject placement with notes too long', () => {
      const placement = createValidPlacement({ notes: 'a'.repeat(501) });
      const result = PlantPlacementSchema.safeParse(placement);
      expect(result.success).toBe(false);
    });

    it('should reject placement with non-finite position', () => {
      const placement = createValidPlacement({
        position: { x: Infinity, y: 10 },
      });
      const result = PlantPlacementSchema.safeParse(placement);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================================================
  // Validation Helper Function Tests
  // ==========================================================================

  describe('validatePatches', () => {
    it('should return success for valid patches array', () => {
      const patches = [createValidPatch(), createValidPatch({ id: 'patch-2' })];
      const result = validatePatches(patches);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should return success for empty array', () => {
      const result = validatePatches([]);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it('should return errors for invalid patches', () => {
      const patches = [
        createValidPatch(),
        createValidPatch({ name: '' }),
      ];
      const result = validatePatches(patches);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should return detailed error paths', () => {
      const patches = [createValidPatch({ name: '' })];
      const result = validatePatches(patches);
      expect(result.success).toBe(false);
      expect(result.errors![0]).toContain('0.name');
    });
  });

  describe('validateBeds', () => {
    it('should return success for valid beds array', () => {
      const beds = [createValidBed(), createValidBed({ id: 'bed-2' })];
      const result = validateBeds(beds);
      expect(result.success).toBe(true);
    });

    it('should return errors for mixed valid/invalid beds', () => {
      const beds = [
        createValidBed(),
        createValidBed({ shape: 'invalid' as unknown as 'rectangle' }),
      ];
      const result = validateBeds(beds);
      expect(result.success).toBe(false);
    });
  });

  describe('validatePlacements', () => {
    it('should return success for valid placements array', () => {
      const placements = [createValidPlacement()];
      const result = validatePlacements(placements);
      expect(result.success).toBe(true);
    });

    it('should return errors for invalid placements', () => {
      const placements = [createValidPlacement({ bedId: '' })];
      const result = validatePlacements(placements);
      expect(result.success).toBe(false);
    });
  });

  describe('single item validators', () => {
    it('validatePatch should work for single patch', () => {
      const result = validatePatch(createValidPatch());
      expect(result.success).toBe(true);
    });

    it('validateBed should work for single bed', () => {
      const result = validateBed(createValidBed());
      expect(result.success).toBe(true);
    });

    it('validatePlacement should work for single placement', () => {
      const result = validatePlacement(createValidPlacement());
      expect(result.success).toBe(true);
    });
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('edge cases', () => {
    it('should handle null input', () => {
      const result = validatePatches(null);
      expect(result.success).toBe(false);
    });

    it('should handle undefined input', () => {
      const result = validatePatches(undefined);
      expect(result.success).toBe(false);
    });

    it('should handle non-array input', () => {
      const result = validatePatches('not an array');
      expect(result.success).toBe(false);
    });

    it('should handle very large valid data', () => {
      const patches = Array.from({ length: 100 }, (_, i) =>
        createValidPatch({ id: `patch-${i}` })
      );
      const result = validatePatches(patches);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(100);
    });

    it('should preserve all data through validation', () => {
      const patch = createValidPatch({
        description: 'Test description',
        location: 'Test location',
        isActive: true,
      });
      const result = validatePatch(patch);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(patch);
    });
  });
});
