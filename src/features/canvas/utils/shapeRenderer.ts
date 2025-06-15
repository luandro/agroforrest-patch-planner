
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { convertToScreenCoordinates, setBedStyles, drawDimensionText, drawResizeHandles } from './bedRenderer';

export const drawBed = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  viewport: CanvasViewport,
  isSelected: boolean = false,
  isPreview: boolean = false,
  isPlacement: boolean = false,
  spacing: number = 0.4,
  hasCollision: boolean = false
) => {
  const canvas = ctx.canvas;
  const { screenX, screenY, pixelsPerMeter } = convertToScreenCoordinates(bed, viewport, canvas.width, canvas.height);

  ctx.save();

  // Set styles based on state and collision
  if (hasCollision && (isPreview || isPlacement)) {
    // Collision state - red tint
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#EF4444'; // Red border for collision
    ctx.fillStyle = '#FEE2E2'; // Light red fill for collision
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 12;
  } else {
    setBedStyles(ctx, isSelected, isPreview, isPlacement);
  }

  // Draw the bed shape
  if (bed.shape === 'rectangle') {
    const length = (bed.dimensions.length || 0) * pixelsPerMeter;
    const width = (bed.dimensions.width || 0) * pixelsPerMeter;
    
    // Draw main shape
    ctx.fillRect(screenX - length / 2, screenY - width / 2, length, width);
    ctx.strokeRect(screenX - length / 2, screenY - width / 2, length, width);
    
    // Draw spacing area if spacing > 0 and not in preview/placement mode
    if (spacing > 0 && !isPreview && !isPlacement) {
      const spacingPixels = spacing * pixelsPerMeter;
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#92400E';
      ctx.setLineDash([]);
      ctx.fillRect(
        screenX - (length / 2 + spacingPixels),
        screenY - (width / 2 + spacingPixels),
        length + spacingPixels * 2,
        width + spacingPixels * 2
      );
      ctx.restore();
    }
    
  } else if (bed.shape === 'circle') {
    const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
    
    // Draw main shape
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Draw spacing area if spacing > 0 and not in preview/placement mode
    if (spacing > 0 && !isPreview && !isPlacement) {
      const spacingPixels = spacing * pixelsPerMeter;
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#92400E';
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius + spacingPixels, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }

  // Draw collision warning for colliding beds
  if (hasCollision && (isPreview || isPlacement)) {
    ctx.restore();
    ctx.save();
    
    // Draw warning border
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    
    if (bed.shape === 'rectangle') {
      const length = (bed.dimensions.length || 0) * pixelsPerMeter;
      const width = (bed.dimensions.width || 0) * pixelsPerMeter;
      ctx.strokeRect(screenX - length / 2 - 2, screenY - width / 2 - 2, length + 4, width + 4);
    } else {
      const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius + 2, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  // Show dimension text for preview and placement beds
  if (isPreview || isPlacement) {
    drawDimensionText(ctx, bed, screenX, screenY);
  }

  // Show resize handles for selected beds (but not preview/placement)
  if (isSelected && !isPreview && !isPlacement) {
    drawResizeHandles(ctx, bed, screenX, screenY, pixelsPerMeter);
  }

  ctx.restore();
};

export const drawSelectionArea = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  ctx.save();
  
  // Selection rectangle
  ctx.strokeStyle = '#0EA5E9';
  ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  const width = endX - startX;
  const height = endY - startY;
  
  ctx.fillRect(startX, startY, width, height);
  ctx.strokeRect(startX, startY, width, height);
  
  ctx.restore();
};
