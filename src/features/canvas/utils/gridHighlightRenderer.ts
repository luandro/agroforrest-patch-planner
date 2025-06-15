
import { CanvasViewport } from '../types/canvas.types';
import { getPixelsPerMeter, getDisplayDimensions, getOffsets } from './gridMath';

/**
 * Draws a circular highlight and crosshair (+) at the given (x,y meters) in canvas space.
 */
export function drawGridHighlight(
  ctx: CanvasRenderingContext2D,
  viewport: CanvasViewport,
  highlightIntersection: { x: number, y: number }
) {
  const canvas = ctx.canvas;
  const { width, height } = getDisplayDimensions(canvas);

  const pixelsPerMeter = getPixelsPerMeter(viewport.zoom);
  const { offsetX, offsetY } = getOffsets(width, height, viewport.centerX, viewport.centerY, pixelsPerMeter);

  const screenX = offsetX + (highlightIntersection.x * pixelsPerMeter);
  const screenY = offsetY - (highlightIntersection.y * pixelsPerMeter);

  if (
    screenX >= -20 &&
    screenX <= width + 20 &&
    screenY >= -20 &&
    screenY <= height + 20
  ) {
    // Draw highlight circle
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw crosshair
    ctx.strokeStyle = 'rgba(34, 197, 94, 1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(screenX - 12, screenY);
    ctx.lineTo(screenX + 12, screenY);
    ctx.moveTo(screenX, screenY - 12);
    ctx.lineTo(screenX, screenY + 12);
    ctx.stroke();
  }
}

