import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { CANVAS, BED } from '../config';
import { COLORS, BED_COLORS, TEXT_COLORS, HANDLE_COLORS } from '../config';

export const convertToScreenCoordinates = (
  bed: Bed,
  viewport: CanvasViewport,
  canvasWidth: number,
  canvasHeight: number
) => {
  const pixelsPerMeter = CANVAS.PIXELS_PER_METER * viewport.zoom;

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
    ctx.globalAlpha = BED.OPACITY_PREVIEW;
    ctx.strokeStyle = BED_COLORS.PREVIEW;
    ctx.fillStyle = BED_COLORS.PREVIEW;
    ctx.lineWidth = BED.LINE_WIDTH_NORMAL;
    ctx.setLineDash(BED.DASH_PATTERN);
    ctx.shadowColor = COLORS.SUCCESS_GREEN_FILL;
    ctx.shadowBlur = BED.SHADOW_BLUR_PREVIEW;
  } else if (isPlacement) {
    ctx.globalAlpha = BED.OPACITY_PLACEMENT;
    ctx.strokeStyle = BED_COLORS.PREVIEW;
    ctx.fillStyle = BED_COLORS.PREVIEW;
    ctx.lineWidth = BED.LINE_WIDTH_PLACEMENT;
    ctx.setLineDash([]);
    ctx.shadowColor = BED_COLORS.PREVIEW;
    ctx.shadowBlur = BED.SHADOW_BLUR_PLACEMENT;
  } else {
    ctx.globalAlpha = 1;
    ctx.fillStyle = BED_COLORS.FILL;
    ctx.strokeStyle = isSelected ? COLORS.SELECTION_BLUE : BED_COLORS.STROKE;
    ctx.lineWidth = isSelected ? BED.LINE_WIDTH_SELECTED : BED.LINE_WIDTH_NORMAL;
    ctx.setLineDash([]);
    ctx.shadowColor = BED_COLORS.SHADOW_TRANSPARENT;
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
  ctx.shadowColor = BED_COLORS.SHADOW_TRANSPARENT;
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);

  ctx.fillStyle = TEXT_COLORS.PRIMARY;
  ctx.strokeStyle = TEXT_COLORS.SECONDARY;
  ctx.lineWidth = 3;
  ctx.font = `bold ${BED.TEXT_FONT_SIZE}px sans-serif`;
  ctx.textAlign = 'center';

  const dimensionText = bed.shape === 'rectangle'
    ? `${bed.dimensions.length}m × ${bed.dimensions.width}m`
    : `⌀ ${(bed.dimensions.radius! * 2).toFixed(1)}m`;

  // Position text below the bed center
  const textY = screenY + BED.TEXT_Y_OFFSET;

  // Draw text background for better visibility
  const textMetrics = ctx.measureText(dimensionText);
  const bgWidth = textMetrics.width + BED.TEXT_PADDING * 2;

  ctx.fillStyle = TEXT_COLORS.BACKGROUND;
  ctx.fillRect(screenX - bgWidth / 2, textY - BED.TEXT_BG_HEIGHT / 2 - 2, bgWidth, BED.TEXT_BG_HEIGHT);

  // Text with stroke for better visibility
  ctx.strokeStyle = TEXT_COLORS.STROKE;
  ctx.fillStyle = TEXT_COLORS.PRIMARY;
  ctx.strokeText(dimensionText, screenX, textY);
  ctx.fillText(dimensionText, screenX, textY);

  // Show coordinates for preview/placement
  if (bed.id.includes('preview') || bed.id.includes('placement')) {
    const coordText = `(${bed.position.x.toFixed(1)}, ${bed.position.y.toFixed(1)})`;
    ctx.font = `${BED.TEXT_COORD_FONT_SIZE}px sans-serif`;
    const coordY = textY + BED.COORD_Y_OFFSET;

    const coordMetrics = ctx.measureText(coordText);
    const coordBgWidth = coordMetrics.width + BED.TEXT_PADDING * 2;

    ctx.fillStyle = TEXT_COLORS.BACKGROUND_LIGHT;
    ctx.fillRect(screenX - coordBgWidth / 2, coordY - 8, coordBgWidth, 16);

    ctx.fillStyle = TEXT_COLORS.TEXT_LIGHT;
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
  ctx.shadowColor = BED_COLORS.SHADOW_TRANSPARENT;
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);

  ctx.fillStyle = HANDLE_COLORS.FILL;
  ctx.strokeStyle = HANDLE_COLORS.STROKE;
  ctx.lineWidth = BED.LINE_WIDTH_NORMAL;

  const handleSize = BED.HANDLE_SIZE;
  
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
