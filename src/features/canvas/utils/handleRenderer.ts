
import { Bed } from '../types/bed.types';

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
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#0EA5E9';
  ctx.lineWidth = 2;
  
  const handleSize = 8;
  
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
