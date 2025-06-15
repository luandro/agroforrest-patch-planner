
import { getPlantVisuals } from './plantVisuals';

export const drawPlant = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  species: any = null,
  isSelected: boolean = false,
  isPreview: boolean = false
) => {
  ctx.save();

  if (isPreview) {
    ctx.globalAlpha = 0.7;
  }

  const { color, radius, symbol } = getPlantVisuals(species);

  // Draw plant circle
  ctx.fillStyle = isSelected ? '#0EA5E9' : color;
  ctx.strokeStyle = isSelected ? '#0284C7' : '#065F46';
  ctx.lineWidth = isSelected ? 3 : 2;
  
  if (isPreview) {
    ctx.setLineDash([3, 3]);
  }

  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // Draw plant symbol/emoji
  ctx.font = `${radius}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  
  if (symbol.startsWith('🌳')) {
    // For emoji, make them slightly smaller
    ctx.font = `${radius * 0.8}px sans-serif`;
    ctx.fillText(symbol, screenX, screenY);
  } else {
    // For text symbols
    ctx.fillText(symbol, screenX, screenY);
  }

  // Draw selection highlight
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 2;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
  }

  ctx.restore();
};
