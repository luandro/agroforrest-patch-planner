import { describe, it, expect } from 'vitest';
import {
  snapToGrid,
  calculateBedPosition,
  calculateBedFootprint,
  checkCollision,
  type WorldPosition,
  type BedFootprint,
} from './bedPositioning';
import type { Bed, BedConfig } from '../types/bed.types';

describe('bedPositioning', () => {
  describe('snapToGrid', () => {
    it('should snap coordinates to grid intersections', () => {
      const result = snapToGrid(1.7, 2.3, 1);
      expect(result.x).toBe(2);
      expect(result.y).toBe(2);
    });

    it('should handle negative coordinates', () => {
      const result = snapToGrid(-1.7, -2.3, 1);
      expect(result.x).toBe(-2);
      expect(result.y).toBe(-2);
    });

    it('should handle zero grid size', () => {
      const result = snapToGrid(1.5, 2.5, 0);
      expect(result.x).toBe(1.5);
      expect(result.y).toBe(2.5);
    });

    it('should handle different grid sizes', () => {
      const result = snapToGrid(1.7, 2.3, 0.5);
      expect(result.x).toBe(1.5);
      expect(result.y).toBe(2.5);
    });

    it('should round to 0.1m precision', () => {
      const result = snapToGrid(1.666666, 2.333333, 1);
      expect(result.x).toBe(2);
      expect(result.y).toBe(2);
    });
  });

  describe('calculateBedPosition', () => {
    const mockBedConfig: BedConfig = {
      shape: 'rectangle',
      length: 2,
      width: 1,
      spacing: 0.4,
      quantity: 1,
    };

    it('should calculate position for rectangle bed', () => {
      const worldPos: WorldPosition = { x: 1.7, y: 2.3 };
      const result = calculateBedPosition(worldPos, 'rectangle', mockBedConfig, 1);

      expect(result.x).toBe(2);
      expect(result.y).toBe(2);
    });

    it('should calculate position for circle bed', () => {
      const worldPos: WorldPosition = { x: 1.7, y: 2.3 };
      const result = calculateBedPosition(worldPos, 'circle', mockBedConfig, 1);

      expect(result.x).toBe(2);
      expect(result.y).toBe(2);
    });

    it('should handle grid size of 0.5', () => {
      const worldPos: WorldPosition = { x: 1.3, y: 2.7 };
      const result = calculateBedPosition(worldPos, 'rectangle', mockBedConfig, 0.5);

      expect(result.x).toBeCloseTo(1.5);
      expect(result.y).toBeCloseTo(2.5);
    });
  });

  describe('calculateBedFootprint', () => {
    it('should calculate footprint for rectangular bed with spacing', () => {
      const now = Date.now();
      const bed: Bed = {
        id: 'test-1',
        shape: 'rectangle',
        position: { x: 5, y: 5 },
        dimensions: { length: 4, width: 2 },
        rotation: 0,
        createdAt: now,
        updatedAt: now,
      };
      const spacing = 1;

      const footprint = calculateBedFootprint(bed, spacing);

      expect(footprint.shape).toBe('rectangle');
      expect(footprint.x).toBe(5 - 2 - 0.5); // center - length/2 - spacing/2
      expect(footprint.y).toBe(5 - 1 - 0.5); // center - width/2 - spacing/2
      expect(footprint.width).toBe(4 + 1); // length + spacing
      expect(footprint.height).toBe(2 + 1); // width + spacing
    });

    it('should calculate footprint for circular bed with spacing', () => {
      const now = Date.now();
      const bed: Bed = {
        id: 'test-2',
        shape: 'circle',
        position: { x: 5, y: 5 },
        dimensions: { radius: 2 },
        rotation: 0,
        createdAt: now,
        updatedAt: now,
      };
      const spacing = 1;

      const footprint = calculateBedFootprint(bed, spacing);

      expect(footprint.shape).toBe('circle');
      expect(footprint.x).toBe(5);
      expect(footprint.y).toBe(5);
      expect(footprint.radius).toBe(2 + 0.5); // radius + spacing/2
      expect(footprint.width).toBe((2 + 0.5) * 2);
      expect(footprint.height).toBe((2 + 0.5) * 2);
    });

    it('should handle zero spacing', () => {
      const now = Date.now();
      const bed: Bed = {
        id: 'test-3',
        shape: 'rectangle',
        position: { x: 0, y: 0 },
        dimensions: { length: 2, width: 1 },
        rotation: 0,
        createdAt: now,
        updatedAt: now,
      };
      const spacing = 0;

      const footprint = calculateBedFootprint(bed, spacing);

      expect(footprint.width).toBe(2);
      expect(footprint.height).toBe(1);
    });
  });

  describe('checkCollision', () => {
    describe('rectangle-rectangle collision', () => {
      it('should detect collision when rectangles overlap', () => {
        const footprint1: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };
        const footprint2: BedFootprint = {
          x: 2,
          y: 1,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };

        expect(checkCollision(footprint1, footprint2)).toBe(true);
      });

      it('should not detect collision when rectangles do not overlap', () => {
        const footprint1: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };
        const footprint2: BedFootprint = {
          x: 5,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };

        expect(checkCollision(footprint1, footprint2)).toBe(false);
      });

      it('should not detect collision when rectangles are adjacent', () => {
        const footprint1: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };
        const footprint2: BedFootprint = {
          x: 4,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };

        expect(checkCollision(footprint1, footprint2)).toBe(false);
      });
    });

    describe('circle-circle collision', () => {
      it('should detect collision when circles overlap', () => {
        const footprint1: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };
        const footprint2: BedFootprint = {
          x: 3,
          y: 0,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };

        expect(checkCollision(footprint1, footprint2)).toBe(true);
      });

      it('should not detect collision when circles do not overlap', () => {
        const footprint1: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };
        const footprint2: BedFootprint = {
          x: 5,
          y: 0,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };

        expect(checkCollision(footprint1, footprint2)).toBe(false);
      });

      it('should not detect collision when circles are exactly touching', () => {
        const footprint1: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };
        const footprint2: BedFootprint = {
          x: 4,
          y: 0,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };

        expect(checkCollision(footprint1, footprint2)).toBe(false);
      });
    });

    describe('circle-rectangle collision', () => {
      it('should detect collision when circle overlaps rectangle', () => {
        const circle: BedFootprint = {
          x: 2,
          y: 1,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };
        const rectangle: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };

        expect(checkCollision(circle, rectangle)).toBe(true);
        expect(checkCollision(rectangle, circle)).toBe(true); // Order shouldn't matter
      });

      it('should not detect collision when circle and rectangle do not overlap', () => {
        const circle: BedFootprint = {
          x: 10,
          y: 10,
          width: 4,
          height: 4,
          shape: 'circle',
          radius: 2,
        };
        const rectangle: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };

        expect(checkCollision(circle, rectangle)).toBe(false);
      });

      it('should detect collision when circle center is inside rectangle', () => {
        const circle: BedFootprint = {
          x: 2,
          y: 1,
          width: 2,
          height: 2,
          shape: 'circle',
          radius: 1,
        };
        const rectangle: BedFootprint = {
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          shape: 'rectangle',
        };

        expect(checkCollision(circle, rectangle)).toBe(true);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle NaN gracefully in snapToGrid', () => {
      const result = snapToGrid(NaN, NaN, 1);
      expect(result.x).toBeNaN();
      expect(result.y).toBeNaN();
    });

    it('should handle Infinity in snapToGrid', () => {
      const result = snapToGrid(Infinity, -Infinity, 1);
      expect(isFinite(result.x) || result.x === Infinity).toBe(true);
    });

    it('should handle zero-sized bed footprint', () => {
      const now = Date.now();
      const bed: Bed = {
        id: 'test-zero',
        shape: 'rectangle',
        position: { x: 0, y: 0 },
        dimensions: { length: 0, width: 0 },
        rotation: 0,
        createdAt: now,
        updatedAt: now,
      };

      const footprint = calculateBedFootprint(bed, 1);
      expect(footprint.width).toBeGreaterThanOrEqual(0);
      expect(footprint.height).toBeGreaterThanOrEqual(0);
    });

    it('should handle very large grid sizes', () => {
      const result = snapToGrid(50, 75, 1000);
      expect(result.x).toBe(0); // Should snap to 0 with large grid
      expect(result.y).toBe(0);
    });

    it('should handle negative spacing in footprint', () => {
      const now = Date.now();
      const bed: Bed = {
        id: 'test-neg',
        shape: 'circle',
        position: { x: 5, y: 5 },
        dimensions: { radius: 2 },
        rotation: 0,
        createdAt: now,
        updatedAt: now,
      };

      // Negative spacing should still work mathematically
      const footprint = calculateBedFootprint(bed, -1);
      expect(footprint.radius).toBe(2 - 0.5); // radius + (spacing/2)
    });
  });
});
