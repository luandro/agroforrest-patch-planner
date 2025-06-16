
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
  
  // Calculate usable canvas area
  const padding = { left: 80, right: 40, top: 40, bottom: 80 };
  const usableWidth = canvas.width - padding.left - padding.right;
  const usableHeight = canvas.height - padding.top - padding.bottom;
  
  // Draw height grid
  drawHeightGrid(ctx, canvas, viewport, padding, usableWidth, usableHeight);
  
  // Draw canopy layer zones
  drawCanopyLayers(ctx, canvas, viewport, padding, usableWidth, usableHeight);
  
  // Draw plants with proper distribution
  bed.plants.forEach(plant => {
    drawSideViewPlant(ctx, plant, viewport, currentMonth, bed.length, padding, usableWidth, usableHeight);
  });
  
  // Draw height scale
  drawHeightScale(ctx, canvas, viewport, padding);
  
  // Draw length scale
  drawLengthScale(ctx, canvas, bed.length, padding, usableWidth);
};

const drawHeightGrid = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  viewport: any,
  padding: any,
  usableWidth: number,
  usableHeight: number
) => {
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  
  const maxHeight = 30; // 30 meters
  const gridSpacing = 5; // Every 5 meters
  
  // Horizontal lines (height markers)
  for (let h = 0; h <= maxHeight; h += gridSpacing) {
    const y = padding.top + usableHeight - (h / maxHeight) * usableHeight;
    
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + usableWidth, y);
    ctx.stroke();
  }
  
  // Vertical lines (length markers every 5 meters)
  const bedLength = viewport.bounds?.width || 50;
  const lengthSpacing = Math.max(5, Math.ceil(bedLength / 8)); // Adaptive spacing
  
  for (let x = 0; x <= bedLength; x += lengthSpacing) {
    const screenX = padding.left + (x / bedLength) * usableWidth;
    
    ctx.beginPath();
    ctx.moveTo(screenX, padding.top);
    ctx.lineTo(screenX, padding.top + usableHeight);
    ctx.stroke();
  }
};

const drawCanopyLayers = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  viewport: any,
  padding: any,
  usableWidth: number,
  usableHeight: number
) => {
  const maxHeight = 30;
  const layers = [
    { name: 'Emergente', minHeight: 25, color: 'rgba(31, 41, 55, 0.08)' },
    { name: 'Dossel', minHeight: 8, color: 'rgba(5, 150, 105, 0.08)' },
    { name: 'Sub-bosque', minHeight: 2, color: 'rgba(52, 211, 153, 0.08)' },
    { name: 'Rasteira', minHeight: 0, color: 'rgba(167, 243, 208, 0.08)' }
  ];
  
  layers.forEach((layer, index) => {
    const nextLayer = layers[index - 1];
    const topHeight = nextLayer?.minHeight || maxHeight;
    const bottomHeight = layer.minHeight;
    
    const topY = padding.top + usableHeight - (topHeight / maxHeight) * usableHeight;
    const bottomY = padding.top + usableHeight - (bottomHeight / maxHeight) * usableHeight;
    
    ctx.fillStyle = layer.color;
    ctx.fillRect(padding.left, topY, usableWidth, bottomY - topY);
    
    // Layer label with better positioning
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(layer.name, canvas.width - padding.right + 5, (topY + bottomY) / 2 + 4);
  });
};

const drawSideViewPlant = (
  ctx: CanvasRenderingContext2D, 
  plant: SideViewPlant, 
  viewport: any, 
  currentMonth: number,
  bedLength: number,
  padding: any,
  usableWidth: number,
  usableHeight: number
) => {
  const maxHeight = 30;
  
  // Calculate screen position with proper distribution
  // Use the full bed length to distribute plants correctly
  const xRatio = plant.position.x / bedLength;
  const screenX = padding.left + (xRatio * usableWidth);
  
  // Calculate Y position based on plant height
  const yRatio = plant.position.height / maxHeight;
  const screenY = padding.top + usableHeight - (yRatio * usableHeight);
  
  // Get layer color with better visibility
  const layerColor = CANOPY_LAYERS[plant.canopyLayer]?.color || '#22C55E';
  
  // Draw trunk/stem with better scaling
  if (plant.position.height > 0.5) {
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = Math.max(1, Math.min(8, plant.position.height * 1.2));
    ctx.beginPath();
    ctx.moveTo(screenX, padding.top + usableHeight);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();
  }
  
  // Draw canopy with improved sizing
  const canopyPixelRadius = Math.max(6, Math.min(25, plant.canopyRadius * 8 + plant.position.height * 1.5));
  
  // Add shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.fillStyle = layerColor;
  ctx.strokeStyle = '#065F46';
  ctx.lineWidth = 1.5;
  
  ctx.beginPath();
  ctx.arc(screenX, screenY, canopyPixelRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Add plant info for debugging with better positioning
  if (process.env.NODE_ENV === 'development') {
    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${plant.speciesId}`, 
      screenX, 
      screenY + canopyPixelRadius + 12
    );
    ctx.fillText(
      `${plant.position.height.toFixed(1)}m`, 
      screenX, 
      screenY + canopyPixelRadius + 24
    );
  }
};

const drawHeightScale = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  viewport: any,
  padding: any
) => {
  ctx.fillStyle = '#374151';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  
  const maxHeight = 30;
  const usableHeight = canvas.height - padding.top - padding.bottom;
  
  // Height markers every 5 meters
  for (let h = 0; h <= maxHeight; h += 5) {
    const y = padding.top + usableHeight - (h / maxHeight) * usableHeight;
    ctx.fillText(`${h}m`, padding.left - 10, y + 4);
  }
  
  // Y-axis label
  ctx.save();
  ctx.translate(25, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#1F2937';
  ctx.fillText('Altura (metros)', 0, 0);
  ctx.restore();
};

const drawLengthScale = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement,
  bedLength: number,
  padding: any,
  usableWidth: number
) => {
  ctx.fillStyle = '#374151';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  
  // Length markers
  const lengthSpacing = Math.max(5, Math.ceil(bedLength / 8));
  for (let x = 0; x <= bedLength; x += lengthSpacing) {
    const screenX = padding.left + (x / bedLength) * usableWidth;
    ctx.fillText(`${x}m`, screenX, canvas.height - padding.bottom + 20);
  }
  
  // X-axis label
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#1F2937';
  ctx.fillText('Comprimento do Canteiro (metros)', canvas.width / 2, canvas.height - 10);
};
