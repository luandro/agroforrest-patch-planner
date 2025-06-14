
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

export const convertToScreenCoordinates = (
  bed: Bed, 
  viewport: CanvasViewport, 
  canvasWidth: number, 
  canvasHeight: number
) => {
  const pixelsPerMeter = 50 * viewport.zoom;
  
  // Convert to display coordinates (accounting for device pixel ratio)
  const displayWidth = canvasWidth / (window.devicePixelRatio || 1);
  const displayHeight = canvasHeight / (window.devicePixelRatio || 1);
  
  const screenX = (displayWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
  const screenY = (displayHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;
  
  return { screenX, screenY, pixelsPerMeter };
};

export const setBedStyles = (
  ctx: CanvasRenderingContext2D,
  isSelected: boolean,
  isPreview: boolean,
  isPlacement: boolean
) => {
  if (isPreview) {
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.9)'; // Brighter green preview
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
    ctx.shadowBlur = 8;
  } else if (isPlacement) {
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#16A34A'; // Solid green for placement
    ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    // Add stronger glow effect
    ctx.shadowColor = '#16A34A';
    ctx.shadowBlur = 12;
  } else {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#D4A574'; // Light brown for beds
    ctx.strokeStyle = isSelected ? '#0EA5E9' : '#92400E'; // Blue if selected, dark brown otherwise
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.setLineDash([]);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
};

export const drawDimensionText = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  screenX: number,
  screenY: number
) => {
  ctx.save();
  
  // Reset styles for text
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
  
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  
  const dimensionText = bed.shape === 'rectangle' 
    ? `${bed.dimensions.length}m × ${bed.dimensions.width}m`
    : `⌀ ${(bed.dimensions.radius! * 2).toFixed(1)}m`;
  
  // Position text below the bed center
  const textY = screenY + 25;
  
  // Draw text background for better visibility
  const textMetrics = ctx.measureText(dimensionText);
  const padding = 4;
  const bgWidth = textMetrics.width + padding * 2;
  const bgHeight = 20;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(screenX - bgWidth / 2, textY - bgHeight / 2 - 2, bgWidth, bgHeight);
  
  // Text with stroke for better visibility
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillStyle = 'white';
  ctx.strokeText(dimensionText, screenX, textY);
  ctx.fillText(dimensionText, screenX, textY);
  
  // Show coordinates for preview/placement
  if (bed.id.includes('preview') || bed.id.includes('placement')) {
    const coordText = `(${bed.position.x.toFixed(1)}, ${bed.position.y.toFixed(1)})`;
    ctx.font = '12px sans-serif';
    const coordY = textY + 18;
    
    const coordMetrics = ctx.measureText(coordText);
    const coordBgWidth = coordMetrics.width + padding * 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(screenX - coordBgWidth / 2, coordY - 8, coordBgWidth, 16);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(coordText, screenX, coordY);
  }
  
  ctx.restore();
};

export const drawResizeHandles = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  screenX: number,
  screenY: number,
  pixelsPerMeter: number
) => {
  ctx.save();
  
  // Reset styles for handles
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#0EA5E9';
  ctx.lineWidth = 2;
  
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
  
  ctx.restore();
};
