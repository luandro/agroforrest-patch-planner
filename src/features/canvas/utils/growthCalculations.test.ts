import { describe, it, expect } from 'vitest';
import {
  calculateGrowthAtMonth,
  calculateEnvironmentalStress,
  applyEnvironmentalStress,
  calculateRealisticGrowth,
} from './growthCalculations';
import type { GrowthDataPoint, SpeciesGrowthProfile } from '../types/growth.types';

describe('growthCalculations', () => {
  const mockDataPoints: GrowthDataPoint[] = [
    { months: 0, canopyRadius: 0.5, height: 0.2, lightPenetration: 80 },
    { months: 12, canopyRadius: 1.5, height: 1.0, lightPenetration: 60 },
    { months: 24, canopyRadius: 3.0, height: 2.5, lightPenetration: 40 },
    { months: 36, canopyRadius: 4.5, height: 4.0, lightPenetration: 20 },
  ];

  describe('calculateGrowthAtMonth', () => {
    it('should return first point for month before all data points', () => {
      const result = calculateGrowthAtMonth(mockDataPoints, -5, 'linear');

      expect(result.canopyRadius).toBe(0.5);
      expect(result.height).toBe(0.2);
      expect(result.lightPenetration).toBe(80);
    });

    it('should return last point for month after all data points', () => {
      const result = calculateGrowthAtMonth(mockDataPoints, 50, 'linear');

      expect(result.canopyRadius).toBe(4.5);
      expect(result.height).toBe(4.0);
      expect(result.lightPenetration).toBe(20);
    });

    it('should interpolate linearly between two points', () => {
      const result = calculateGrowthAtMonth(mockDataPoints, 6, 'linear');

      // Should be halfway between month 0 and month 12
      expect(result.canopyRadius).toBeCloseTo(1.0, 1);
      expect(result.height).toBeCloseTo(0.6, 1);
      expect(result.lightPenetration).toBeCloseTo(70, 0);
    });

    it('should handle exact month match', () => {
      const result = calculateGrowthAtMonth(mockDataPoints, 12, 'linear');

      expect(result.canopyRadius).toBe(1.5);
      expect(result.height).toBe(1.0);
      expect(result.lightPenetration).toBe(60);
    });

    it('should use sigmoid curve when specified', () => {
      const result = calculateGrowthAtMonth(mockDataPoints, 6, 'sigmoid');

      // Sigmoid curve at midpoint should be close to but not exactly the linear midpoint
      // Values should still be between the two points
      expect(result.canopyRadius).toBeGreaterThan(0.5);
      expect(result.canopyRadius).toBeLessThan(1.5);
      expect(result.height).toBeGreaterThan(0.2);
      expect(result.height).toBeLessThan(1.0);
    });

    it('should use exponential curve when specified', () => {
      const result = calculateGrowthAtMonth(mockDataPoints, 6, 'exponential');

      // Exponential should produce different results than linear
      expect(result.canopyRadius).not.toBe(1.0);
      // Values should still be between the two points
      expect(result.canopyRadius).toBeGreaterThan(0.5);
      expect(result.canopyRadius).toBeLessThan(1.5);
    });

    it('should handle single data point', () => {
      const singlePoint: GrowthDataPoint[] = [
        { months: 12, canopyRadius: 2.0, height: 1.5, lightPenetration: 50 },
      ];

      const resultBefore = calculateGrowthAtMonth(singlePoint, 0, 'linear');
      const resultAfter = calculateGrowthAtMonth(singlePoint, 24, 'linear');

      expect(resultBefore.canopyRadius).toBe(2.0);
      expect(resultAfter.canopyRadius).toBe(2.0);
    });
  });

  describe('calculateEnvironmentalStress', () => {
    const plantPosition = { x: 0, y: 0 };

    it('should return 0 stress with no nearby plants and good conditions', () => {
      const stress = calculateEnvironmentalStress(plantPosition, [], 1.0, 1.0);

      expect(stress).toBe(0);
    });

    it('should calculate stress from overlapping canopy', () => {
      const nearbyPlants = [
        {
          position: { x: 1, y: 0 },
          canopyRadius: 2,
          height: 3,
        },
      ];

      const stress = calculateEnvironmentalStress(plantPosition, nearbyPlants, 1.0, 1.0);

      // Distance = 1, canopyRadius = 2, overlap = 1, overlapRatio = 0.5
      // competitionStress = 0.5 * 0.3 = 0.15
      expect(stress).toBeCloseTo(0.15, 2);
    });

    it('should calculate stress from poor soil quality', () => {
      const stress = calculateEnvironmentalStress(plantPosition, [], 0.5, 1.0);

      // environmentalStress = (2 - 0.5 - 1.0) * 0.2 = 0.1
      expect(stress).toBeCloseTo(0.1, 2);
    });

    it('should calculate stress from low water availability', () => {
      const stress = calculateEnvironmentalStress(plantPosition, [], 1.0, 0.5);

      // environmentalStress = (2 - 1.0 - 0.5) * 0.2 = 0.1
      expect(stress).toBeCloseTo(0.1, 2);
    });

    it('should combine multiple stress sources', () => {
      const nearbyPlants = [
        {
          position: { x: 1, y: 0 },
          canopyRadius: 2,
          height: 3,
        },
      ];

      const stress = calculateEnvironmentalStress(plantPosition, nearbyPlants, 0.5, 0.5);

      // competitionStress = 0.15, environmentalStress = 0.2
      // total = 0.15 + 0.2 = 0.35
      expect(stress).toBeGreaterThan(0.3);
      expect(stress).toBeLessThan(0.4);
    });

    it('should cap stress at 1.0', () => {
      const nearbyPlants = [
        {
          position: { x: 0.5, y: 0 },
          canopyRadius: 5,
          height: 3,
        },
        {
          position: { x: -0.5, y: 0 },
          canopyRadius: 5,
          height: 3,
        },
        {
          position: { x: 0, y: 0.5 },
          canopyRadius: 5,
          height: 3,
        },
        {
          position: { x: 0, y: -0.5 },
          canopyRadius: 5,
          height: 3,
        },
      ];

      const stress = calculateEnvironmentalStress(plantPosition, nearbyPlants, 0, 0);

      // With multiple large overlapping plants and poor environmental conditions,
      // stress should be capped at 1.0
      expect(stress).toBe(1.0);
    });

    it('should not add stress from non-overlapping plants', () => {
      const nearbyPlants = [
        {
          position: { x: 10, y: 10 },
          canopyRadius: 2,
          height: 3,
        },
      ];

      const stress = calculateEnvironmentalStress(plantPosition, nearbyPlants, 1.0, 1.0);

      expect(stress).toBe(0);
    });
  });

  describe('applyEnvironmentalStress', () => {
    const baseGrowth = {
      canopyRadius: 3.0,
      height: 2.5,
      lightPenetration: 40,
    };

    it('should not affect growth with zero stress', () => {
      const result = applyEnvironmentalStress(baseGrowth, 0, 0.5);

      expect(result.canopyRadius).toBe(3.0);
      expect(result.height).toBe(2.5);
      expect(result.lightPenetration).toBe(40);
    });

    it('should reduce growth with stress', () => {
      const result = applyEnvironmentalStress(baseGrowth, 0.6, 0);

      // actualStress = 0.6 * (1 - 0) = 0.6
      // growthReduction = 1 - (0.6 * 0.5) = 0.7
      expect(result.canopyRadius).toBeCloseTo(3.0 * 0.7, 2);
      expect(result.height).toBeCloseTo(2.5 * 0.7, 2);
      // Light penetration increases with stress
      expect(result.lightPenetration).toBeGreaterThan(40);
    });

    it('should respect competition resistance', () => {
      const resultLowResistance = applyEnvironmentalStress(baseGrowth, 0.6, 0);
      const resultHighResistance = applyEnvironmentalStress(baseGrowth, 0.6, 0.8);

      // High resistance should reduce the effect of stress
      expect(resultHighResistance.canopyRadius).toBeGreaterThan(resultLowResistance.canopyRadius);
      expect(resultHighResistance.height).toBeGreaterThan(resultLowResistance.height);
    });

    it('should increase light penetration with stress', () => {
      const result = applyEnvironmentalStress(baseGrowth, 0.5, 0);

      // actualStress = 0.5
      // lightPenetration = 40 + (0.5 * 10) = 45
      expect(result.lightPenetration).toBeCloseTo(45, 1);
    });

    it('should handle maximum stress', () => {
      const result = applyEnvironmentalStress(baseGrowth, 1.0, 0);

      // growthReduction = 1 - (1.0 * 0.5) = 0.5
      expect(result.canopyRadius).toBeCloseTo(1.5, 2);
      expect(result.height).toBeCloseTo(1.25, 2);
      expect(result.lightPenetration).toBeCloseTo(50, 1);
    });
  });

  describe('calculateRealisticGrowth', () => {
    const mockProfile: SpeciesGrowthProfile = {
      dataPoints: mockDataPoints,
      growthCurveType: 'sigmoid',
      environmentalFactors: {
        soilQualityEffect: 1.2,
        waterAvailabilityEffect: 1.3,
        competitionResistance: 0.5,
      },
    };

    const plantPosition = { x: 0, y: 0 };

    it('should calculate realistic growth without competition', () => {
      const result = calculateRealisticGrowth(
        mockProfile,
        12,
        plantPosition,
        [],
        1.0,
        1.0
      );

      expect(result.canopyRadius).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.lightPenetration).toBeGreaterThan(0);
    });

    it('should reduce growth with nearby competition', () => {
      const nearbyPlants = [
        {
          position: { x: 1, y: 0 },
          canopyRadius: 2,
          height: 3,
        },
      ];

      const withoutCompetition = calculateRealisticGrowth(
        mockProfile,
        12,
        plantPosition,
        [],
        1.0,
        1.0
      );

      const withCompetition = calculateRealisticGrowth(
        mockProfile,
        12,
        plantPosition,
        nearbyPlants,
        1.0,
        1.0
      );

      expect(withCompetition.canopyRadius).toBeLessThan(withoutCompetition.canopyRadius);
      expect(withCompetition.height).toBeLessThan(withoutCompetition.height);
    });

    it('should adjust growth based on soil quality', () => {
      const goodSoil = calculateRealisticGrowth(
        mockProfile,
        12,
        plantPosition,
        [],
        1.0,
        1.0
      );

      const poorSoil = calculateRealisticGrowth(
        mockProfile,
        12,
        plantPosition,
        [],
        0.5,
        1.0
      );

      expect(poorSoil.canopyRadius).toBeLessThan(goodSoil.canopyRadius);
      expect(poorSoil.height).toBeLessThan(goodSoil.height);
    });

    it('should adjust growth based on water availability', () => {
      const goodWater = calculateRealisticGrowth(
        mockProfile,
        12,
        plantPosition,
        [],
        1.0,
        1.0
      );

      const lowWater = calculateRealisticGrowth(
        mockProfile,
        12,
        plantPosition,
        [],
        1.0,
        0.5
      );

      expect(lowWater.canopyRadius).toBeLessThan(goodWater.canopyRadius);
      expect(lowWater.height).toBeLessThan(goodWater.height);
    });
  });
});
