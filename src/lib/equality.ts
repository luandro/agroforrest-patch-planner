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
  
  // Null/undefined checks
  if (!a || !b) return false;

  // Compare primitive fields
  if (a.id !== b.id) return false;
  if (a.patchId !== b.patchId) return false;
  if (a.shape !== b.shape) return false;
  if (a.rotation !== b.rotation) return false;
  if (a.createdAt !== b.createdAt) return false;
  if (a.updatedAt !== b.updatedAt) return false;

  // Compare position
  if (a.position.x !== b.position.x || a.position.y !== b.position.y) return false;

  // Compare dimensions
  if (a.dimensions.length !== b.dimensions.length) return false;
  if (a.dimensions.width !== b.dimensions.width) return false;
  if (a.dimensions.radius !== b.dimensions.radius) return false;

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
 * Deep equality check with proper handling of edge cases
 * Handles: primitives, arrays, objects, null, undefined, Date, NaN
 * Does NOT handle: functions, symbols, circular references, Map, Set
 */
export function deepEqual<T>(a: T, b: T): boolean {
  // Same reference or both primitives with same value
  if (a === b) return true;

  // Handle null/undefined
  if (a == null || b == null) return a === b;

  // Handle NaN (NaN !== NaN in JavaScript)
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
  }

  // Different types
  if (typeof a !== typeof b) return false;

  // Handle Date objects
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Handle objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    // Different number of keys
    if (keysA.length !== keysB.length) return false;

    // Check all keys exist and values are equal
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}
