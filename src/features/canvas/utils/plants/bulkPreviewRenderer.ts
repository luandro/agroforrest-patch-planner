
import { getBulkPreviewVisuals } from './plantVisuals';

export const drawBulkPreviewPlant = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  species: any = null,
  position: any
) => {
  ctx.save();
  ctx.globalAlpha = 0.6;

  const { color, radius } = getBulkPreviewVisuals(species);

  // Draw preview circle with pattern indicator
  ctx.fillStyle = color;
  ctx.strokeStyle = '#065F46';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);

  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // Draw row/column indicators for better visualization
  if (position.row === 0 || position.column === 0) {
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore();
};
