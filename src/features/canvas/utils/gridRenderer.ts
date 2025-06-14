
import { CanvasViewport } from '../types/canvas.types';

export const drawGrid = (ctx: CanvasRenderingContext2D, viewport: CanvasViewport, gridSize: number) => {
  const canvas = ctx.canvas;
  const { width, height } = canvas;
  const { zoom, centerX, centerY } = viewport;

  // Calculate grid parameters
  const pixelsPerMeter = 50 * zoom; // Base scale: 50 pixels per meter
  const gridPixelSize = pixelsPerMeter * gridSize;
  
  // Grid opacity based on zoom (more visible when zoomed in)
  const opacity = Math.min(1, zoom * 0.3 + 0.1);
  
  ctx.strokeStyle = `rgba(229, 231, 235, ${opacity})`;
  ctx.lineWidth = 1;

  // Calculate grid offset
  const offsetX = (width / 2) - (centerX * pixelsPerMeter);
  const offsetY = (height / 2) - (centerY * pixelsPerMeter);

  // Draw vertical lines
  const startX = Math.floor((-offsetX) / gridPixelSize) * gridPixelSize + offsetX;
  for (let x = startX; x < width + gridPixelSize; x += gridPixelSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw horizontal lines
  const startY = Math.floor((-offsetY) / gridPixelSize) * gridPixelSize + offsetY;
  for (let y = startY; y < height + gridPixelSize; y += gridPixelSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};
