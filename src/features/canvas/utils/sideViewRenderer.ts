
import { SideViewPlant, SideViewBed } from '../types/sideView.types';
import { CANOPY_LAYERS } from '../data/heightGrowthData';

interface RenderSideViewParams {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  bed: SideViewBed;
  viewport: any;
  currentMonth: number;
}

export const renderSideView = ({
  ctx,
  canvas,
  bed,
  viewport,
  currentMonth
}: RenderSideViewParams) => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set background
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw height grid
  drawHeightGrid(ctx, canvas, viewport);
  
  // Draw canopy layer zones
  drawCanopyLayers(ctx, canvas, viewport);
  
  // Draw plants
  bed.plants.forEach(plant => {
    drawSideViewPlant(ctx, plant, viewport, currentMonth);
  });
  
  // Draw height scale
  drawHeightScale(ctx, canvas, viewport);
};

const drawHeightGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, viewport: any) => {
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  
  const maxHeight = 30; // 30 meters
  const gridSpacing = 5; // Every 5 meters
  
  // Horizontal lines (height markers)
  for (let h = 0; h <= maxHeight; h += gridSpacing) {
    const y = canvas.height - (h / maxHeight) * canvas.height * 0.9 - 50;
    
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(canvas.width - 20, y);
    ctx.stroke();
  }
  
  // Vertical lines (length markers)
  const bedLength = viewport.bounds?.width || 50;
  const lengthSpacing = 5; // Every 5 meters
  
  for (let x = 0; x <= bedLength; x += lengthSpacing) {
    const screenX = 50 + (x / bedLength) * (canvas.width - 70);
    
    ctx.beginPath();
    ctx.moveTo(screenX, 50);
    ctx.lineTo(screenX, canvas.height - 50);
    ctx.stroke();
  }
};

const drawCanopyLayers = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, viewport: any) => {
  const maxHeight = 30;
  const layers = [
    { name: 'Emergente', minHeight: 25, color: 'rgba(31, 41, 55, 0.1)' },
    { name: 'Dossel', minHeight: 8, color: 'rgba(5, 150, 105, 0.1)' },
    { name: 'Sub-bosque', minHeight: 2, color: 'rgba(52, 211, 153, 0.1)' },
    { name: 'Rasteira', minHeight: 0, color: 'rgba(167, 243, 208, 0.1)' }
  ];
  
  layers.forEach((layer, index) => {
    const nextLayer = layers[index - 1];
    const topHeight = nextLayer?.minHeight || maxHeight;
    const bottomHeight = layer.minHeight;
    
    const topY = canvas.height - (topHeight / maxHeight) * canvas.height * 0.9 - 50;
    const bottomY = canvas.height - (bottomHeight / maxHeight) * canvas.height * 0.9 - 50;
    
    ctx.fillStyle = layer.color;
    ctx.fillRect(50, topY, canvas.width - 70, bottomY - topY);
    
    // Layer label
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.fillText(layer.name, canvas.width - 60, (topY + bottomY) / 2);
  });
};

const drawSideViewPlant = (
  ctx: CanvasRenderingContext2D, 
  plant: SideViewPlant, 
  viewport: any, 
  currentMonth: number
) => {
  const bedLength = viewport.bounds?.width || 50;
  const maxHeight = 30;
  
  // Calculate screen position
  const screenX = 50 + (plant.position.x / bedLength) * (ctx.canvas.width - 70);
  const screenY = ctx.canvas.height - (plant.position.height / maxHeight) * ctx.canvas.height * 0.9 - 50;
  
  // Get layer color
  const layerColor = CANOPY_LAYERS[plant.canopyLayer].color;
  
  // Draw trunk/stem
  if (plant.position.height > 0.5) {
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = Math.max(2, plant.position.height * 0.5);
    ctx.beginPath();
    ctx.moveTo(screenX, ctx.canvas.height - 50);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();
  }
  
  // Draw canopy (circle)
  const canopyPixelRadius = Math.max(4, plant.canopyRadius * 5);
  
  ctx.fillStyle = layerColor;
  ctx.strokeStyle = '#065F46';
  ctx.lineWidth = 1;
  
  ctx.beginPath();
  ctx.arc(screenX, screenY, canopyPixelRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Add plant info for debugging
  if (process.env.NODE_ENV === 'development') {
    ctx.fillStyle = '#000';
    ctx.font = '8px sans-serif';
    ctx.fillText(`${plant.speciesId} ${plant.position.height.toFixed(1)}m`, screenX + canopyPixelRadius + 2, screenY);
  }
};

const drawHeightScale = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, viewport: any) => {
  ctx.fillStyle = '#374151';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  
  const maxHeight = 30;
  
  // Height markers
  for (let h = 0; h <= maxHeight; h += 5) {
    const y = canvas.height - (h / maxHeight) * canvas.height * 0.9 - 50;
    ctx.fillText(`${h}m`, 45, y + 4);
  }
  
  // Y-axis label
  ctx.save();
  ctx.translate(20, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.font = '14px sans-serif';
  ctx.fillText('Altura (metros)', 0, 0);
  ctx.restore();
  
  // X-axis label
  ctx.textAlign = 'center';
  ctx.fillText('Comprimento do Canteiro (metros)', canvas.width / 2, canvas.height - 20);
};
