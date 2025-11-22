import { describe, it, expect } from 'vitest';
import { areBedsEqual, areArraysEqual, deepEqual } from './equality';
import { Bed } from '@/features/canvas/types/bed.types';

// Helper to create a test bed
const createBed = (overrides: Partial<Bed> = {}): Bed => ({
  id: 'bed-1',
  patchId: 'patch-1',
  shape: 'rectangle',
  position: { x: 5, y: 5 },
  dimensions: { length: 2, width: 1 },
  rotation: 0,
  createdAt: 1000,
  updatedAt: 2000,
  ...overrides,
});

describe('areBedsEqual', () => {
  describe('array-level comparisons', () => {
    it('returns true for two empty arrays', () => {
      expect(areBedsEqual([], [])).toBe(true);
    });

    it('returns false for arrays of different lengths', () => {
      const bed = createBed();
      expect(areBedsEqual([bed], [])).toBe(false);
      expect(areBedsEqual([], [bed])).toBe(false);
      expect(areBedsEqual([bed, bed], [bed])).toBe(false);
    });

    it('returns true for identical single-bed arrays', () => {
      const bed = createBed();
      expect(areBedsEqual([bed], [bed])).toBe(true);
    });

    it('returns true for identical multi-bed arrays', () => {
      const bed1 = createBed({ id: 'bed-1' });
      const bed2 = createBed({ id: 'bed-2' });
      expect(areBedsEqual([bed1, bed2], [bed1, bed2])).toBe(true);
    });

    it('returns false when beds are in different order', () => {
      const bed1 = createBed({ id: 'bed-1' });
      const bed2 = createBed({ id: 'bed-2' });
      expect(areBedsEqual([bed1, bed2], [bed2, bed1])).toBe(false);
    });

    it('returns true for reference-equal arrays', () => {
      const beds = [createBed()];
      expect(areBedsEqual(beds, beds)).toBe(true);
    });
  });

  describe('primitive field comparisons', () => {
    it('returns false when id differs', () => {
      const bed1 = createBed({ id: 'bed-1' });
      const bed2 = createBed({ id: 'bed-2' });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('returns false when patchId differs', () => {
      const bed1 = createBed({ patchId: 'patch-1' });
      const bed2 = createBed({ patchId: 'patch-2' });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('handles undefined patchId correctly', () => {
      const bed1 = createBed({ patchId: undefined });
      const bed2 = createBed({ patchId: undefined });
      expect(areBedsEqual([bed1], [bed2])).toBe(true);

      const bed3 = createBed({ patchId: 'patch-1' });
      expect(areBedsEqual([bed1], [bed3])).toBe(false);
    });

    it('returns false when shape differs', () => {
      const bed1 = createBed({ shape: 'rectangle' });
      const bed2 = createBed({ shape: 'circle' });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('returns false when rotation differs', () => {
      const bed1 = createBed({ rotation: 0 });
      const bed2 = createBed({ rotation: 45 });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('returns false when createdAt differs', () => {
      const bed1 = createBed({ createdAt: 1000 });
      const bed2 = createBed({ createdAt: 2000 });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('returns false when updatedAt differs', () => {
      const bed1 = createBed({ updatedAt: 1000 });
      const bed2 = createBed({ updatedAt: 2000 });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });
  });

  describe('position comparisons', () => {
    it('returns false when position.x differs', () => {
      const bed1 = createBed({ position: { x: 5, y: 5 } });
      const bed2 = createBed({ position: { x: 6, y: 5 } });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('returns false when position.y differs', () => {
      const bed1 = createBed({ position: { x: 5, y: 5 } });
      const bed2 = createBed({ position: { x: 5, y: 6 } });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('detects subtle position differences', () => {
      const bed1 = createBed({ position: { x: 5.001, y: 5 } });
      const bed2 = createBed({ position: { x: 5.002, y: 5 } });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });
  });

  describe('dimension comparisons', () => {
    it('returns false when length differs', () => {
      const bed1 = createBed({ dimensions: { length: 2, width: 1 } });
      const bed2 = createBed({ dimensions: { length: 3, width: 1 } });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('returns false when width differs', () => {
      const bed1 = createBed({ dimensions: { length: 2, width: 1 } });
      const bed2 = createBed({ dimensions: { length: 2, width: 2 } });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('returns false when radius differs', () => {
      const bed1 = createBed({ shape: 'circle', dimensions: { radius: 1 } });
      const bed2 = createBed({ shape: 'circle', dimensions: { radius: 2 } });
      expect(areBedsEqual([bed1], [bed2])).toBe(false);
    });

    it('handles undefined dimensions correctly', () => {
      const bed1 = createBed({ dimensions: { length: 2, width: 1 } });
      const bed2 = createBed({ dimensions: { length: 2, width: 1, radius: undefined } });
      expect(areBedsEqual([bed1], [bed2])).toBe(true);

      const bed3 = createBed({ shape: 'circle', dimensions: { radius: 1 } });
      const bed4 = createBed({ shape: 'circle', dimensions: { radius: 1, length: undefined, width: undefined } });
      expect(areBedsEqual([bed3], [bed4])).toBe(true);

      const bed5 = createBed({ dimensions: { length: 2, width: 1 } });
      const bed6 = createBed({ shape: 'circle', dimensions: { radius: 1 } });
      expect(areBedsEqual([bed5], [bed6])).toBe(false);
    });
  });

  describe('reference equality optimization', () => {
    it('returns true immediately for same reference', () => {
      const bed = createBed();
      // Same object reference should return true without deep comparison
      expect(areBedsEqual([bed], [bed])).toBe(true);
    });
  });
});

describe('areArraysEqual', () => {
  it('returns true for empty arrays', () => {
    expect(areArraysEqual([], [])).toBe(true);
  });

  it('returns false for arrays of different lengths', () => {
    expect(areArraysEqual([1], [])).toBe(false);
    expect(areArraysEqual([1, 2], [1])).toBe(false);
  });

  it('returns true for identical primitive arrays', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(areArraysEqual(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  it('returns false for different primitive arrays', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(areArraysEqual(['a', 'b'], ['a', 'c'])).toBe(false);
  });

  it('uses reference equality for objects', () => {
    const obj = { value: 1 };
    expect(areArraysEqual([obj], [obj])).toBe(true);
    expect(areArraysEqual([{ value: 1 }], [{ value: 1 }])).toBe(false);
  });
});

describe('deepEqual', () => {
  it('returns true for identical primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('test', 'test')).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  it('returns false for different primitives', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'b')).toBe(false);
  });

  it('returns true for identical objects', () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
  });

  it('returns false for different objects', () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('returns true for identical arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('returns false for different arrays', () => {
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });
});
