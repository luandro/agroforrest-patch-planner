
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { 
  convertToScreenCoordinates, 
  drawDimensionText, 
  drawResizeHandles 
} from './bedRenderer';
import { drawSpacingArea } from './spacingRenderer';

const setBedStyles = (
  ctx: CanvasRenderingContext2D,
  isSelected: boolean,
  isPreview: boolean,
  isPlacement: boolean
) => {
  if (isPreview) {
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)'; // Green preview
    ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 8;
  } else if (isPlacement) {
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#10B981'; // Solid green for placement
    ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.shadowColor = '#10B981';
    ctx.shadowBlur = 12;
  } else {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FEF3C7'; // Light yellow-brown for actual beds
    ctx.strokeStyle = isSelected ? '#0EA5E9' : '#92400E'; // Blue if selected, dark brown otherwise
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.setLineDash([]);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
};

export const drawRectangleBed = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  viewport: CanvasViewport,
  isSelected: boolean,
  isPreview: boolean,
  isPlacement: boolean,
  spacing: number = 0
) => {
  const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
  const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
  
  const { screenX, screenY, pixelsPerMeter } = convertToScreenCoordinates(
    bed, viewport, canvasWidth, canvasHeight
  );

  // Draw spacing area first (behind the bed)
  if (spacing > 0) {
    drawSpacingArea(ctx, bed, viewport, spacing, isPreview, isPlacement);
  }

  // Set bed styles
  ctx.save();
  setBedStyles(ctx, isSelected, isPreview, isPlacement);

  const length = (bed.dimensions.length || 0) * pixelsPerMeter;
  const width = (bed.dimensions.width || 0) * pixelsPerMeter;
  
  ctx.fillRect(screenX - length / 2, screenY - width / 2, length, width);
  ctx.strokeRect(screenX - length / 2, screenY - width / 2, length, width);
  
  ctx.restore();
  
  // Draw dimensions text for preview and placement
  if (isPreview || isPlacement) {
    drawDimensionText(ctx, bed, screenX, screenY);
  }
  
  // Draw resize handles if selected
  if (isSelected && !isPreview) {
    drawResizeHandles(ctx, bed, screenX, screenY, pixelsPerMeter);
  }
};

export const drawCircleBed = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  viewport: CanvasViewport,
  isSelected: boolean,
  isPreview: boolean,
  isPlacement: boolean,
  spacing: number = 0
) => {
  const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
  const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
  
  const { screenX, screenY, pixelsPerMeter } = convertToScreenCoordinates(
    bed, viewport, canvasWidth, canvasHeight
  );

  // Draw spacing area first (behind the bed)
  if (spacing > 0) {
    drawSpacingArea(ctx, bed, viewport, spacing, isPreview, isPlacement);
  }

  // Set bed styles
  ctx.save();
  setBedStyles(ctx, isSelected, isPreview, isPlacement);

  const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
  
  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
  
  // Draw dimensions text for preview and placement
  if (isPreview || isPlacement) {
    drawDimensionText(ctx, bed, screenX, screenY);
  }
  
  // Draw resize handle if selected
  if (isSelected && !isPreview) {
    drawResizeHandles(ctx, bed, screenX, screenY, pixelsPerMeter);
  }
};

export const drawBed = (
  ctx: CanvasRenderingContext2D, 
  bed: Bed, 
  viewport: CanvasViewport,
  isSelected: boolean = false,
  isPreview: boolean = false,
  isPlacement: boolean = false,
  spacing: number = 0
) => {
  if (bed.shape === 'rectangle') {
    drawRectangleBed(ctx, bed, viewport, isSelected, isPreview, isPlacement, spacing);
  } else {
    drawCircleBed(ctx, bed, viewport, isSelected, isPreview, isPlacement, spacing);
  }
};
