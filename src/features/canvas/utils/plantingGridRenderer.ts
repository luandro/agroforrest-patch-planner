
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { getPixelsPerMeter, getDisplayDimensions, getOffsets } from './gridMath';

interface PlantingGridRendererArgs {
  ctx: CanvasRenderingContext2D;
  viewport: CanvasViewport;
  focusedBed: Bed;
  zoom: number;
}

/**
 * Draws the fine 10cm planting grid INSIDE the focused bed.
 */
export function drawPlantingGrid({
  ctx,
  viewport,
  focusedBed,
  zoom
}: PlantingGridRendererArgs) {
  const canvas = ctx.canvas;
  const { width, height } = getDisplayDimensions(canvas);
  const pixelsPerMeter = getPixelsPerMeter(zoom);
  const { centerX, centerY } = viewport;
  const { offsetX, offsetY } = getOffsets(width, height, centerX, centerY, pixelsPerMeter);

  // Bed screen center
  const bedScreenX = offsetX + (focusedBed.position.x * pixelsPerMeter);
  const bedScreenY = offsetY - (focusedBed.position.y * pixelsPerMeter);

  // Bed bounds in screen coordinates
  let bedBounds: { minX: number; maxX: number; minY: number; maxY: number };

  if (focusedBed.shape === 'rectangle') {
    const length = (focusedBed.dimensions.length || 1) * pixelsPerMeter;
    const width_ = (focusedBed.dimensions.width || 1) * pixelsPerMeter;
    bedBounds = {
      minX: bedScreenX - length / 2,
      maxX: bedScreenX + length / 2,
      minY: bedScreenY - width_ / 2,
      maxY: bedScreenY + width_ / 2
    };
  } else {
    const radius = (focusedBed.dimensions.radius || 0.5) * pixelsPerMeter;
    bedBounds = {
      minX: bedScreenX - radius,
      maxX: bedScreenX + radius,
      minY: bedScreenY - radius,
      maxY: bedScreenY + radius
    };
  }

  // Fine grid: 10cm
  const fineGridSize = 0.1;
  const finePixelSize = pixelsPerMeter * fineGridSize;

  const fineOpacity = Math.max(0.6, Math.min(1.0, viewport.zoom * 0.3 + 0.3));
  ctx.strokeStyle = `rgba(21, 128, 61, ${fineOpacity})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  // Clipping path for bed shape
  ctx.save();
  ctx.beginPath();

  if (focusedBed.shape === 'rectangle') {
    const length = (focusedBed.dimensions.length || 1) * pixelsPerMeter;
    const width_ = (focusedBed.dimensions.width || 1) * pixelsPerMeter;
    ctx.rect(
      bedScreenX - length / 2,
      bedScreenY - width_ / 2,
      length,
      width_
    );
  } else {
    const radius = (focusedBed.dimensions.radius || 0.5) * pixelsPerMeter;
    ctx.arc(bedScreenX, bedScreenY, radius, 0, 2 * Math.PI);
  }

  ctx.clip();

  // DEBUG outline
  if (import.meta.env.DEV) {
    ctx.save();
    ctx.beginPath();
    if (focusedBed.shape === 'rectangle') {
      const length = (focusedBed.dimensions.length || 1) * pixelsPerMeter;
      const width_ = (focusedBed.dimensions.width || 1) * pixelsPerMeter;
      ctx.rect(
        bedScreenX - length / 2,
        bedScreenY - width_ / 2,
        length,
        width_
      );
    } else {
      const radius = (focusedBed.dimensions.radius || 0.5) * pixelsPerMeter;
      ctx.arc(bedScreenX, bedScreenY, radius, 0, 2 * Math.PI);
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 3]);
    ctx.stroke();
    ctx.restore();
  }

  // Start/end in meters for fine grid
  const startFineMeterX = Math.floor((bedBounds.minX - offsetX) / pixelsPerMeter / fineGridSize) * fineGridSize;
  const endFineMeterX = Math.ceil((bedBounds.maxX - offsetX) / pixelsPerMeter / fineGridSize) * fineGridSize;
  const startFineMeterY = Math.floor(((-bedBounds.maxY + offsetY) / pixelsPerMeter) / fineGridSize) * fineGridSize;
  const endFineMeterY = Math.ceil(((-bedBounds.minY + offsetY) / pixelsPerMeter) / fineGridSize) * fineGridSize;

  // Fine grid vertical lines
  for (let meterX = startFineMeterX; meterX <= endFineMeterX; meterX += fineGridSize) {
    const screenX = offsetX + (meterX * pixelsPerMeter);
    if (screenX >= bedBounds.minX - 1 && screenX <= bedBounds.maxX + 1) {
      ctx.beginPath();
      ctx.moveTo(screenX, bedBounds.minY);
      ctx.lineTo(screenX, bedBounds.maxY);
      ctx.stroke();
    }
  }

  // Fine grid horizontal lines
  for (let meterY = startFineMeterY; meterY <= endFineMeterY; meterY += fineGridSize) {
    const screenY = offsetY - (meterY * pixelsPerMeter);
    if (screenY >= bedBounds.minY - 1 && screenY <= bedBounds.maxY + 1) {
      ctx.beginPath();
      ctx.moveTo(bedBounds.minX, screenY);
      ctx.lineTo(bedBounds.maxX, screenY);
      ctx.stroke();
    }
  }

  // Grid intersection dots
  if (zoom > 1.5) {
    ctx.fillStyle = `rgba(21, 128, 61, ${fineOpacity * 0.8})`;
    const dotSize = 2;

    for (let meterX = startFineMeterX; meterX <= endFineMeterX; meterX += fineGridSize) {
      for (let meterY = startFineMeterY; meterY <= endFineMeterY; meterY += fineGridSize) {
        const screenX = offsetX + (meterX * pixelsPerMeter);
        const screenY = offsetY - (meterY * pixelsPerMeter);

        if (
          screenX >= bedBounds.minX &&
          screenX <= bedBounds.maxX &&
          screenY >= bedBounds.minY &&
          screenY <= bedBounds.maxY
        ) {
          ctx.fillRect(screenX - dotSize / 2, screenY - dotSize / 2, dotSize, dotSize);
        }
      }
    }
  }

  ctx.restore();
}
