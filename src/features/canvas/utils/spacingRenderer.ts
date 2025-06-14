
import { Bed } from '../types/bed.types';

const drawSpacingPattern = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  ctx.save();
  ctx.fillStyle = '#E5E7EB';
  ctx.globalAlpha = 0.6;
  
  const dotSize = 1;
  const spacing = 10;
  
  for (let i = x; i < x + width; i += spacing) {
    for (let j = y; j < y + height; j += spacing) {
      ctx.fillRect(i, j, dotSize, dotSize);
    }
  }
  
  ctx.restore();
};

const drawSpacingPatternCircle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) => {
  ctx.save();
  ctx.fillStyle = '#E5E7EB';
  ctx.globalAlpha = 0.6;
  
  const dotSize = 1;
  const spacing = 10;
  
  for (let i = centerX - radius; i < centerX + radius; i += spacing) {
    for (let j = centerY - radius; j < centerY + radius; j += spacing) {
      const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
      if (distance <= radius) {
        ctx.fillRect(i, j, dotSize, dotSize);
      }
    }
  }
  
  ctx.restore();
};

export const drawSpacingArea = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  screenX: number,
  screenY: number,
  pixelsPerMeter: number,
  spacing: number,
  isPreview: boolean,
  isPlacement: boolean
) => {
  ctx.save();
  
  // Set spacing area styles
  if (isPreview) {
    ctx.fillStyle = 'rgba(107, 114, 128, 0.3)'; // Gray, 30% opacity for preview
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
  } else if (isPlacement) {
    ctx.fillStyle = 'rgba(107, 114, 128, 0.4)';
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
  } else {
    ctx.fillStyle = '#F3F4F6'; // Light gray for spacing
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
  }
  
  ctx.globalAlpha = isPreview ? 0.6 : 0.8;
  
  const spacingPixels = spacing * pixelsPerMeter;
  
  if (bed.shape === 'rectangle') {
    const length = (bed.dimensions.length || 0) * pixelsPerMeter;
    const width = (bed.dimensions.width || 0) * pixelsPerMeter;
    
    // Draw spacing area (larger rectangle)
    const spacingLength = length + (spacingPixels * 2);
    const spacingWidth = width + (spacingPixels * 2);
    
    ctx.fillRect(
      screenX - spacingLength / 2, 
      screenY - spacingWidth / 2, 
      spacingLength, 
      spacingWidth
    );
    ctx.strokeRect(
      screenX - spacingLength / 2, 
      screenY - spacingWidth / 2, 
      spacingLength, 
      spacingWidth
    );
    
    // Add subtle pattern for non-preview spacing
    if (!isPreview && !isPlacement) {
      drawSpacingPattern(ctx, screenX - spacingLength / 2, screenY - spacingWidth / 2, spacingLength, spacingWidth);
    }
    
  } else {
    const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
    const spacingRadius = radius + spacingPixels;
    
    // Draw spacing area (larger circle)
    ctx.beginPath();
    ctx.arc(screenX, screenY, spacingRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Add subtle pattern for non-preview spacing
    if (!isPreview && !isPlacement) {
      drawSpacingPatternCircle(ctx, screenX, screenY, spacingRadius);
    }
  }
  
  ctx.restore();
};
