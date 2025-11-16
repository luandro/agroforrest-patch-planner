import { CanvasViewport } from '../types/canvas.types';
import { BedConfig, Bed, BedDimensions } from '../types/bed.types';

export interface WorldPosition {
  x: number;
  y: number;
}

export interface BedFootprint {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rectangle' | 'circle';
  radius?: number;
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

// Calculate the full footprint of a bed including spacing
export const calculateBedFootprint = (bed: Bed, spacing: number): BedFootprint => {
  // This footprint represents the bed plus *half* the required spacing on each side.
  // When two such footprints are checked for collision, it enforces the total `spacing` gap between the beds.
  const halfSpacing = spacing / 2.0;

  if (bed.shape === 'rectangle') {
    const length = bed.dimensions.length || 0;
    const width = bed.dimensions.width || 0;
    
    return {
      x: bed.position.x - (length / 2) - halfSpacing,
      y: bed.position.y - (width / 2) - halfSpacing,
      width: length + spacing, // length + halfSpacing on left/right
      height: width + spacing, // width + halfSpacing on top/bottom
      shape: 'rectangle'
    };
  } else {
    const radius = bed.dimensions.radius || 0;
    
    return {
      x: bed.position.x,
      y: bed.position.y,
      width: (radius + halfSpacing) * 2,
      height: (radius + halfSpacing) * 2,
      shape: 'circle',
      radius: radius + halfSpacing
    };
  }
};

// Check if two bed footprints collide
export const checkCollision = (footprint1: BedFootprint, footprint2: BedFootprint): boolean => {
  if (footprint1.shape === 'rectangle' && footprint2.shape === 'rectangle') {
    // Rectangle-Rectangle collision
    const rect1 = {
      left: footprint1.x,
      right: footprint1.x + footprint1.width,
      top: footprint1.y,
      bottom: footprint1.y + footprint1.height
    };
    
    const rect2 = {
      left: footprint2.x,
      right: footprint2.x + footprint2.width,
      top: footprint2.y,
      bottom: footprint2.y + footprint2.height
    };
    
    return !(rect1.right <= rect2.left || 
             rect1.left >= rect2.right || 
             rect1.bottom <= rect2.top || 
             rect1.top >= rect2.bottom);
  } else if (footprint1.shape === 'circle' && footprint2.shape === 'circle') {
    // Circle-Circle collision
    const dx = footprint1.x - footprint2.x;
    const dy = footprint1.y - footprint2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < (footprint1.radius! + footprint2.radius!);
  } else {
    // Circle-Rectangle collision
    const circle = footprint1.shape === 'circle' ? footprint1 : footprint2;
    const rect = footprint1.shape === 'rectangle' ? footprint1 : footprint2;
    
    // Find the closest point on the rectangle to the circle center
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    // Calculate distance from circle center to closest point
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < circle.radius!;
  }
};

// Check if position has collision with existing beds (legacy function)
export const checkCollisionLegacy = (position: WorldPosition, dimensions: BedDimensions): boolean => {
  // This would check against existing beds in a real implementation
  // For now, just return false
  return false;
};
