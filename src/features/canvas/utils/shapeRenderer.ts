
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';
import { 
  convertToScreenCoordinates, 
  setBedStyles, 
  drawDimensionText, 
  drawResizeHandles 
} from './bedRenderer';
import { drawSpacingArea } from './spacingRenderer';

export const drawRectangleBed = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  viewport: CanvasViewport,
  isSelected: boolean,
  isPreview: boolean,
  isPlacement: boolean,
  spacing: number = 0.4
) => {
  const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
  const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
  
  const { screenX, screenY, pixelsPerMeter } = convertToScreenCoordinates(
    bed, viewport, canvasWidth, canvasHeight
  );

  // 1. Draw spacing area first (behind bed)
  if (spacing > 0) {
    drawSpacingArea(ctx, bed, viewport, spacing, isPreview, isPlacement);
  }

  // 2. Draw bed area
  ctx.save();
  setBedStyles(ctx, isSelected, isPreview, isPlacement);

  const length = (bed.dimensions.length || 0) * pixelsPerMeter;
  const width = (bed.dimensions.width || 0) * pixelsPerMeter;
  
  ctx.fillRect(screenX - length / 2, screenY - width / 2, length, width);
  ctx.strokeRect(screenX - length / 2, screenY - width / 2, length, width);
  
  ctx.restore();

  // 3. Draw dimensions text for preview and placement
  if (isPreview || isPlacement) {
    drawDimensionText(ctx, bed, screenX, screenY);
  }
  
  // 4. Draw resize handles if selected
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
  spacing: number = 0.4
) => {
  const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
  const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
  
  const { screenX, screenY, pixelsPerMeter } = convertToScreenCoordinates(
    bed, viewport, canvasWidth, canvasHeight
  );

  // 1. Draw spacing area first (behind bed)
  if (spacing > 0) {
    drawSpacingArea(ctx, bed, viewport, spacing, isPreview, isPlacement);
  }

  // 2. Draw bed area
  ctx.save();
  setBedStyles(ctx, isSelected, isPreview, isPlacement);

  const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
  
  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();

  // 3. Draw dimensions text for preview and placement
  if (isPreview || isPlacement) {
    drawDimensionText(ctx, bed, screenX, screenY);
  }
  
  // 4. Draw resize handle if selected
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
  spacing: number = 0.4
) => {
  if (bed.shape === 'rectangle') {
    drawRectangleBed(ctx, bed, viewport, isSelected, isPreview, isPlacement, spacing);
  } else {
    drawCircleBed(ctx, bed, viewport, isSelected, isPreview, isPlacement, spacing);
  }
};
