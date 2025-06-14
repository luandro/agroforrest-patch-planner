
import { Bed } from '../types/bed.types';

export const drawDimensionText = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  screenX: number,
  screenY: number
) => {
  ctx.save();
  
  // Reset styles for text
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
  
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  
  const dimensionText = bed.shape === 'rectangle' 
    ? `${bed.dimensions.length}m × ${bed.dimensions.width}m`
    : `⌀ ${(bed.dimensions.radius! * 2).toFixed(1)}m`;
  
  // Position text below the bed center
  const textY = screenY + 25;
  
  // Draw text background for better visibility
  const textMetrics = ctx.measureText(dimensionText);
  const padding = 4;
  const bgWidth = textMetrics.width + padding * 2;
  const bgHeight = 20;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(screenX - bgWidth / 2, textY - bgHeight / 2 - 2, bgWidth, bgHeight);
  
  // Text with stroke for better visibility
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillStyle = 'white';
  ctx.strokeText(dimensionText, screenX, textY);
  ctx.fillText(dimensionText, screenX, textY);
  
  // Show coordinates for preview/placement
  if (bed.id.includes('preview') || bed.id.includes('placement')) {
    const coordText = `(${bed.position.x.toFixed(1)}, ${bed.position.y.toFixed(1)})`;
    ctx.font = '12px sans-serif';
    const coordY = textY + 18;
    
    const coordMetrics = ctx.measureText(coordText);
    const coordBgWidth = coordMetrics.width + padding * 2;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(screenX - coordBgWidth / 2, coordY - 8, coordBgWidth, 16);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(coordText, screenX, coordY);
  }
  
  ctx.restore();
};
