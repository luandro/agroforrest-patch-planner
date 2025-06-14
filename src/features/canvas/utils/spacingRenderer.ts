
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { convertToScreenCoordinates } from './bedRenderer';

export const drawSpacingArea = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  viewport: CanvasViewport,
  spacing: number,
  isPreview: boolean = false,
  isPlacement: boolean = false
) => {
  const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
  const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
  
  const { screenX, screenY, pixelsPerMeter } = convertToScreenCoordinates(
    bed, viewport, canvasWidth, canvasHeight
  );

  ctx.save();

  // Set spacing area styles
  if (isPreview) {
    ctx.fillStyle = 'rgba(107, 114, 128, 0.3)'; // Gray 30% opacity for preview
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
  } else if (isPlacement) {
    ctx.fillStyle = 'rgba(107, 114, 128, 0.4)'; // Gray 40% opacity for placement
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
  } else {
    ctx.fillStyle = '#F3F4F6'; // Light gray for actual spacing
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
  }

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

    // Add dot pattern for non-preview spacing areas
    if (!isPreview && !isPlacement) {
      drawDotPattern(ctx, screenX - spacingLength / 2, screenY - spacingWidth / 2, spacingLength, spacingWidth);
    }
  } else {
    const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
    const spacingRadius = radius + spacingPixels;
    
    // Draw spacing area (larger circle)
    ctx.beginPath();
    ctx.arc(screenX, screenY, spacingRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Add dot pattern for non-preview spacing areas
    if (!isPreview && !isPlacement) {
      drawCircularDotPattern(ctx, screenX, screenY, spacingRadius);
    }
  }

  ctx.restore();
};

const drawDotPattern = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  ctx.save();
  ctx.fillStyle = '#E5E7EB';
  const dotSize = 1;
  const spacing = 10;
  
  for (let px = x + spacing / 2; px < x + width; px += spacing) {
    for (let py = y + spacing / 2; py < y + height; py += spacing) {
      ctx.beginPath();
      ctx.arc(px, py, dotSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  ctx.restore();
};

const drawCircularDotPattern = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) => {
  ctx.save();
  ctx.fillStyle = '#E5E7EB';
  const dotSize = 1;
  const spacing = 10;
  
  for (let x = centerX - radius; x <= centerX + radius; x += spacing) {
    for (let y = centerY - radius; y <= centerY + radius; y += spacing) {
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (distance <= radius) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
  ctx.restore();
};
