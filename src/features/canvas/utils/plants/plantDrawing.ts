
import { getPlantVisuals } from './plantVisuals';

export const drawPlant = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  species: any = null,
  isSelected: boolean = false,
  isPreview: boolean = false,
  isHovered: boolean = false
) => {
  ctx.save();

  if (isPreview) {
    ctx.globalAlpha = 0.7;
  }

  const { color, radius, symbol } = getPlantVisuals(species);

  // Selection glow effect
  if (isSelected) {
    ctx.shadowColor = '#0EA5E9';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else if (isHovered) {
    ctx.shadowColor = '#94A3B8';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Draw plant circle
  ctx.fillStyle = isSelected ? '#0EA5E9' : color;
  ctx.strokeStyle = isSelected ? '#0284C7' : (isHovered ? '#64748B' : '#065F46');
  ctx.lineWidth = isSelected ? 4 : (isHovered ? 3 : 2);
  
  if (isPreview) {
    ctx.setLineDash([3, 3]);
  }

  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // Reset shadow for symbol
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Draw plant symbol/emoji
  ctx.font = `${radius}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isSelected ? 'white' : (color === '#FFF' ? '#000' : 'white');
  
  if (symbol.startsWith('🌳')) {
    // For emoji, make them slightly smaller
    ctx.font = `${radius * 0.8}px sans-serif`;
    ctx.fillText(symbol, screenX, screenY);
  } else {
    // For text symbols
    ctx.fillText(symbol, screenX, screenY);
  }

  // Draw selection handles for editing
  if (isSelected) {
    const handleSize = 4;
    const handleOffset = radius + 6;
    
    ctx.fillStyle = '#0EA5E9';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    // Draw selection handles at cardinal points
    const positions = [
      { x: screenX - handleOffset, y: screenY }, // Left
      { x: screenX + handleOffset, y: screenY }, // Right
      { x: screenX, y: screenY - handleOffset }, // Top
      { x: screenX, y: screenY + handleOffset }  // Bottom
    ];

    positions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, handleSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
  }

  // Hover highlight ring
  if (isHovered && !isSelected) {
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius + 3, 0, 2 * Math.PI);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
  }

  ctx.restore();
};

// Draw selection area rectangle
export const drawSelectionArea = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  ctx.save();
  
  // Selection rectangle
  ctx.strokeStyle = '#0EA5E9';
  ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  
  ctx.restore();
};
