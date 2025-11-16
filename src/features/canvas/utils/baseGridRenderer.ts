
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { getPixelsPerMeter, getDisplayDimensions, getOffsets } from './gridMath';

interface BaseGridRendererArgs {
  ctx: CanvasRenderingContext2D;
  viewport: CanvasViewport;
  gridSize: number;
  zoom: number;
  focusedBed?: Bed | null;
}

/**
 * Draws the main meter grid, and grid intersections (dots) if zoomed in enough.
 * No fine planting grid, no clipping.
 */
export function drawBaseGrid({
  ctx,
  viewport,
  gridSize,
  zoom,
  focusedBed
}: BaseGridRendererArgs) {
  if (focusedBed) return; // Main grid hidden in focus mode

  const canvas = ctx.canvas;
  const { width, height } = getDisplayDimensions(canvas);
  const pixelsPerMeter = getPixelsPerMeter(zoom);
  const { centerX, centerY } = viewport;
  const { offsetX, offsetY } = getOffsets(width, height, centerX, centerY, pixelsPerMeter);

  const opacity = Math.min(0.8, zoom * 0.3 + 0.1);

  ctx.strokeStyle = `rgba(229, 231, 235, ${opacity})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  // Vertical grid lines
  const startXMeter = Math.floor(((-offsetX) / pixelsPerMeter) - 1);
  const endXMeter = Math.ceil(((width - offsetX) / pixelsPerMeter) + 1);
  for (let meterX = startXMeter; meterX <= endXMeter; meterX += gridSize) {
    const screenX = offsetX + (meterX * pixelsPerMeter);
    if (screenX >= -1 && screenX <= width + 1) {
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, height);
      ctx.stroke();
    }
  }

  // Horizontal grid lines
  const startYMeter = Math.floor(((offsetY - height) / pixelsPerMeter) - 1);
  const endYMeter = Math.ceil((offsetY / pixelsPerMeter) + 1);
  for (let meterY = startYMeter; meterY <= endYMeter; meterY += gridSize) {
    const screenY = offsetY - (meterY * pixelsPerMeter);
    if (screenY >= -1 && screenY <= height + 1) {
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(width, screenY);
      ctx.stroke();
    }
  }

  // Intersection markers (dots at grid points), for better visibility at high zoom
  if (zoom > 1.5) {
    ctx.fillStyle = `rgba(156, 163, 175, ${opacity * 0.6})`;
    const markerSize = 2;

    for (let meterX = startXMeter; meterX <= endXMeter; meterX += gridSize) {
      for (let meterY = startYMeter; meterY <= endYMeter; meterY += gridSize) {
        const screenX = offsetX + (meterX * pixelsPerMeter);
        const screenY = offsetY - (meterY * pixelsPerMeter);

        if (
          screenX >= -markerSize &&
          screenX <= width + markerSize &&
          screenY >= -markerSize &&
          screenY <= height + markerSize
        ) {
          ctx.fillRect(screenX - markerSize / 2, screenY - markerSize / 2, markerSize, markerSize);
        }
      }
    }
  }
}
