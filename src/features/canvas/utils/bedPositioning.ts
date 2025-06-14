
import { CanvasViewport } from '../types/canvas.types';
import { BedConfig } from '../types/bed.types';

export interface WorldPosition {
  x: number;
  y: number;
}

// Convert screen coordinates to world coordinates with proper canvas transformation
export const screenToWorld = (
  screenX: number, 
  screenY: number, 
  viewport: CanvasViewport
): WorldPosition => {
  // Get canvas element and its bounding rect for accurate positioning
  const canvas = document.querySelector('canvas');
  if (!canvas) return { x: 0, y: 0 };
  
  const rect = canvas.getBoundingClientRect();
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Calculate relative position within canvas
  const canvasX = (screenX - rect.left) * devicePixelRatio;
  const canvasY = (screenY - rect.top) * devicePixelRatio;
  
  // Convert canvas pixels to display pixels
  const displayX = canvasX / devicePixelRatio;
  const displayY = canvasY / devicePixelRatio;
  
  // Canvas dimensions
  const canvasWidth = rect.width;
  const canvasHeight = rect.height;
  
  // Scale factor: pixels per meter in world space
  const pixelsPerMeter = 50 * viewport.zoom;
  
  // Convert to world coordinates with proper centering
  const worldX = viewport.centerX + (displayX - canvasWidth / 2) / pixelsPerMeter;
  const worldY = viewport.centerY - (displayY - canvasHeight / 2) / pixelsPerMeter;
  
  return { x: worldX, y: worldY };
};

// Snap coordinates to grid intersections with proper alignment
export const snapToGrid = (x: number, y: number, gridSize: number): WorldPosition => {
  if (!gridSize || gridSize <= 0) return { x, y };
  
  // Snap to grid intersections (not cell centers)
  const snappedX = Math.round(x / gridSize) * gridSize;
  const snappedY = Math.round(y / gridSize) * gridSize;
  
  return { 
    x: Math.round(snappedX * 10) / 10, // Round to 0.1m precision
    y: Math.round(snappedY * 10) / 10
  };
};

// Calculate bed position based on shape and snapping rules
export const calculateBedPosition = (
  worldPos: WorldPosition, 
  shape: 'rectangle' | 'circle',
  bedConfig: BedConfig,
  gridSize: number
): WorldPosition => {
  const snappedPos = snapToGrid(worldPos.x, worldPos.y, gridSize);
  
  if (shape === 'rectangle') {
    // For rectangles, snap the center point and ensure edges align with grid
    const adjustedX = Math.round(snappedPos.x / gridSize) * gridSize;
    const adjustedY = Math.round(snappedPos.y / gridSize) * gridSize;
    
    return { x: adjustedX, y: adjustedY };
  } else {
    // For circles, always snap center to grid intersection
    return snappedPos;
  }
};

// Check if position has collision with existing beds
export const checkCollision = (position: WorldPosition, dimensions: any): boolean => {
  // This would check against existing beds in a real implementation
  // For now, just return false
  return false;
};
