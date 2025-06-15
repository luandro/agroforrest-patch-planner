
import { getPlantVisuals } from './plantVisuals';

export const drawPlant = (
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  species: any = null,
  isSelected: boolean = false,
  isPreview: boolean = false,
  isHovered: boolean = false,
  growthMonth?: number
) => {
  ctx.save();

  if (isPreview) {
    ctx.globalAlpha = 0.7;
  }

  const { color, radius, symbol } = getPlantVisuals(species, growthMonth);

  // Enhanced selection glow effect
  if (isSelected) {
    ctx.shadowColor = '#0EA5E9';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else if (isHovered) {
    ctx.shadowColor = '#64748B';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Draw plant circle with enhanced states
  if (isSelected) {
    ctx.fillStyle = '#0EA5E9';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 4;
  } else if (isHovered) {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
  } else {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#065F46';
    ctx.lineWidth = 2;
  }
  
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

  // Draw enhanced selection handles for editing
  if (isSelected) {
    const handleSize = 5;
    const handleOffset = radius + 8;
    
    ctx.fillStyle = '#0EA5E9';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
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

  // Enhanced hover highlight ring
  if (isHovered && !isSelected) {
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
  }

  // Selection count badge for multi-select (if needed)
  if (isSelected) {
    // This could be enhanced to show selection count
    ctx.beginPath();
    ctx.arc(screenX + radius - 3, screenY - radius + 3, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#0EA5E9';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
};

// Enhanced selection area rectangle with better visual feedback
export const drawSelectionArea = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  ctx.save();
  
  // Selection rectangle with enhanced styling
  ctx.strokeStyle = '#0EA5E9';
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  
  // Add corner indicators for better UX
  const cornerSize = 8;
  ctx.setLineDash([]);
  ctx.fillStyle = '#0EA5E9';
  
  // Draw corner squares
  const corners = [
    { x, y },
    { x: x + width - cornerSize, y },
    { x, y: y + height - cornerSize },
    { x: x + width - cornerSize, y: y + height - cornerSize }
  ];
  
  corners.forEach(corner => {
    ctx.fillRect(corner.x, corner.y, cornerSize, cornerSize);
  });
  
  ctx.restore();
};
