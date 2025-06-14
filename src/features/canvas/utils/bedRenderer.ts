
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

export const convertToScreenCoordinates = (
  bed: Bed, 
  viewport: CanvasViewport, 
  canvasWidth: number, 
  canvasHeight: number
) => {
  const pixelsPerMeter = 50 * viewport.zoom;
  
  const screenX = (canvasWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
  const screenY = (canvasHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;
  
  return { screenX, screenY, pixelsPerMeter };
};

export const setBedStyles = (
  ctx: CanvasRenderingContext2D,
  isSelected: boolean,
  isPreview: boolean,
  isPlacement: boolean
) => {
  if (isPreview) {
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; // Green preview
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
  } else if (isPlacement) {
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = '#16A34A'; // Solid green for placement
    ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    // Add glow effect
    ctx.shadowColor = '#16A34A';
    ctx.shadowBlur = 10;
  } else {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#D4A574'; // Light brown for beds
    ctx.strokeStyle = isSelected ? '#0EA5E9' : '#92400E'; // Blue if selected, dark brown otherwise
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.setLineDash([]);
  }
};

export const drawDimensionText = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  screenX: number,
  screenY: number
) => {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  
  const dimensionText = bed.shape === 'rectangle' 
    ? `${bed.dimensions.length}m × ${bed.dimensions.width}m`
    : `⌀ ${(bed.dimensions.radius! * 2).toFixed(1)}m`;
  
  const textY = screenY + 5;
  
  // Text with stroke for better visibility
  ctx.strokeText(dimensionText, screenX, textY);
  ctx.fillText(dimensionText, screenX, textY);
  ctx.restore();
};

export const drawResizeHandles = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  screenX: number,
  screenY: number,
  pixelsPerMeter: number
) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#0EA5E9';
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  
  const handleSize = 8;
  
  if (bed.shape === 'rectangle') {
    const length = (bed.dimensions.length || 0) * pixelsPerMeter;
    const width = (bed.dimensions.width || 0) * pixelsPerMeter;
    
    const handles = [
      { x: screenX - length / 2, y: screenY - width / 2 }, // Top-left
      { x: screenX + length / 2, y: screenY - width / 2 }, // Top-right
      { x: screenX - length / 2, y: screenY + width / 2 }, // Bottom-left
      { x: screenX + length / 2, y: screenY + width / 2 }  // Bottom-right
    ];
    
    handles.forEach(handle => {
      ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
    });
  } else {
    const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
    ctx.fillRect(screenX + radius - handleSize / 2, screenY - handleSize / 2, handleSize, handleSize);
    ctx.strokeRect(screenX + radius - handleSize / 2, screenY - handleSize / 2, handleSize, handleSize);
  }
};
