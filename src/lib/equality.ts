/**
 * Utility functions for structural equality comparisons
 * More performant than JSON.stringify for equality checks
 */

import { Bed } from '@/features/canvas/types/bed.types';

/**
 * Shallow compare two arrays of beds for equality
 * More efficient than JSON.stringify for large bed arrays
 */
export function areBedsEqual(a: Bed[], b: Bed[]): boolean {
  // Quick length check
  if (a.length !== b.length) return false;

  // Empty arrays are equal
  if (a.length === 0) return true;

  // Compare each bed
  for (let i = 0; i < a.length; i++) {
    if (!isBedEqual(a[i], b[i])) return false;
  }

  return true;
}

/**
 * Compare two individual beds for equality
 */
function isBedEqual(a: Bed, b: Bed): boolean {
  // Quick reference check
  if (a === b) return true;

  // Compare primitive fields
  if (a.id !== b.id) return false;
  if (a.shape !== b.shape) return false;

  // Compare position
  if (a.position.x !== b.position.x || a.position.y !== b.position.y) return false;

  // Compare dimensions
  if (a.dimensions.length !== b.dimensions.length) return false;
  if (a.dimensions.width !== b.dimensions.width) return false;
  if (a.dimensions.radius !== b.dimensions.radius) return false;
  if (a.dimensions.rotation !== b.dimensions.rotation) return false;

  return true;
}

/**
 * Generic shallow array equality
 * For arrays of primitives or when reference equality is sufficient
 */
export function areArraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Deep equality check using JSON.stringify
 * Use sparingly - only for small objects where structural equality is needed
 */
export function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
