
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

  if (isPreview) {
    // Preview mode: gray spacing area
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#6B7280';
    ctx.strokeStyle = 'transparent';
  } else if (isPlacement) {
    // Placement mode: gray spacing area
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#6B7280';
    ctx.strokeStyle = 'transparent';
  } else {
    // Placed bed: light gray with dot pattern
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#F3F4F6';
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 8]);
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
    
    if (!isPreview && !isPlacement) {
      // Draw dashed border for placed beds
      ctx.strokeRect(
        screenX - spacingLength / 2, 
        screenY - spacingWidth / 2, 
        spacingLength, 
        spacingWidth
      );
      
      // Draw dot pattern for placed beds
      drawDotPattern(ctx, screenX, screenY, spacingLength, spacingWidth, length, width, pixelsPerMeter);
    }
  } else {
    // Circle spacing
    const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
    const spacingRadius = radius + spacingPixels;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, spacingRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    if (!isPreview && !isPlacement) {
      // Draw dashed border for placed beds
      ctx.stroke();
      
      // Draw dot pattern for placed beds
      drawCircularDotPattern(ctx, screenX, screenY, spacingRadius, radius, pixelsPerMeter);
    }
  }

  ctx.restore();
};

const drawDotPattern = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  spacingLength: number,
  spacingWidth: number,
  bedLength: number,
  bedWidth: number,
  pixelsPerMeter: number
) => {
  ctx.save();
  ctx.fillStyle = '#E5E7EB';
  ctx.globalAlpha = 0.6;
  
  const dotSize = Math.max(2, pixelsPerMeter * 0.05); // 5cm dots minimum 2px
  const dotSpacing = Math.max(10, pixelsPerMeter * 0.2); // 20cm spacing minimum 10px
  
  // Create clipping region for spacing area only (exclude bed area)
  ctx.beginPath();
  ctx.rect(centerX - spacingLength / 2, centerY - spacingWidth / 2, spacingLength, spacingWidth);
  ctx.rect(centerX - bedLength / 2, centerY - bedWidth / 2, bedLength, bedWidth);
  ctx.clip('evenodd');
  
  // Draw dots in spacing area
  for (let x = centerX - spacingLength / 2; x <= centerX + spacingLength / 2; x += dotSpacing) {
    for (let y = centerY - spacingWidth / 2; y <= centerY + spacingWidth / 2; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  
  ctx.restore();
};

const drawCircularDotPattern = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  spacingRadius: number,
  bedRadius: number,
  pixelsPerMeter: number
) => {
  ctx.save();
  ctx.fillStyle = '#E5E7EB';
  ctx.globalAlpha = 0.6;
  
  const dotSize = Math.max(2, pixelsPerMeter * 0.05); // 5cm dots minimum 2px
  const dotSpacing = Math.max(10, pixelsPerMeter * 0.2); // 20cm spacing minimum 10px
  
  // Create clipping region for spacing area only (exclude bed area)
  ctx.beginPath();
  ctx.arc(centerX, centerY, spacingRadius, 0, 2 * Math.PI);
  ctx.arc(centerX, centerY, bedRadius, 0, 2 * Math.PI);
  ctx.clip('evenodd');
  
  // Draw dots in circular pattern
  const gridSize = spacingRadius * 2;
  for (let x = centerX - gridSize / 2; x <= centerX + gridSize / 2; x += dotSpacing) {
    for (let y = centerY - gridSize / 2; y <= centerY + gridSize / 2; y += dotSpacing) {
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (distance <= spacingRadius && distance >= bedRadius) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
  
  ctx.restore();
};
