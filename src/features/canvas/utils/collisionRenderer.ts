
/**
 * Collision indicator rendering utilities
 */

import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

export const drawCollisionIndicators = (
  ctx: CanvasRenderingContext2D, 
  viewport: CanvasViewport, 
  beds: Bed[]
) => {
  ctx.save();
  
  beds.forEach(bed => {
    const pixelsPerMeter = 50 * viewport.zoom;
    const displayWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
    const displayHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
    
    const screenX = (displayWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
    const screenY = (displayHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;
    
    // Draw warning icon
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️', screenX, screenY - 30);
    
    // Draw warning text
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.font = 'bold 12px sans-serif';
    const warningText = 'COLISÃO';
    ctx.strokeText(warningText, screenX, screenY - 10);
    ctx.fillText(warningText, screenX, screenY - 10);
  });
  
  ctx.restore();
};
