
import { Bed } from '../../types/bed.types';

export const createBedClippingPath = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  bedScreenX: number,
  bedScreenY: number,
  pixelsPerMeter: number
) => {
  ctx.beginPath();
  
  if (bed.shape === 'rectangle') {
    const length = (bed.dimensions.length || 1) * pixelsPerMeter;
    const width = (bed.dimensions.width || 1) * pixelsPerMeter;
    ctx.rect(
      bedScreenX - length / 2, 
      bedScreenY - width / 2, 
      length, 
      width
    );
  } else {
    const radius = (bed.dimensions.radius || 0.5) * pixelsPerMeter;
    ctx.arc(bedScreenX, bedScreenY, radius, 0, 2 * Math.PI);
  }
  
  ctx.clip();
};
