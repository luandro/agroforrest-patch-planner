
import { CanvasViewport } from '../types/canvas.types';

export const drawGrid = (
  ctx: CanvasRenderingContext2D, 
  viewport: CanvasViewport, 
  gridSize: number,
  highlightIntersection?: { x: number; y: number }
) => {
  const canvas = ctx.canvas;
  const { width, height } = canvas;
  const { zoom, centerX, centerY } = viewport;

  // Calculate grid parameters
  const pixelsPerMeter = 50 * zoom; // Base scale: 50 pixels per meter
  const gridPixelSize = pixelsPerMeter * gridSize;
  
  // Grid opacity based on zoom (more visible when zoomed in)
  const opacity = Math.min(0.8, zoom * 0.3 + 0.1);
  
  // Calculate display dimensions (accounting for device pixel ratio)
  const displayWidth = width / (window.devicePixelRatio || 1);
  const displayHeight = height / (window.devicePixelRatio || 1);
  
  // Calculate grid offset for proper alignment
  const offsetX = (displayWidth / 2) - (centerX * pixelsPerMeter);
  const offsetY = (displayHeight / 2) + (centerY * pixelsPerMeter); // Invert Y
  
  // Draw main grid lines
  ctx.strokeStyle = `rgba(229, 231, 235, ${opacity})`;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  // Draw vertical lines (at meter marks)
  const startXMeter = Math.floor(((-offsetX) / pixelsPerMeter) - 1);
  const endXMeter = Math.ceil(((displayWidth - offsetX) / pixelsPerMeter) + 1);
  
  for (let meterX = startXMeter; meterX <= endXMeter; meterX += gridSize) {
    const screenX = offsetX + (meterX * pixelsPerMeter);
    if (screenX >= -1 && screenX <= displayWidth + 1) {
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, displayHeight);
      ctx.stroke();
    }
  }

  // Draw horizontal lines (at meter marks)
  const startYMeter = Math.floor(((offsetY - displayHeight) / pixelsPerMeter) - 1);
  const endYMeter = Math.ceil((offsetY / pixelsPerMeter) + 1);
  
  for (let meterY = startYMeter; meterY <= endYMeter; meterY += gridSize) {
    const screenY = offsetY - (meterY * pixelsPerMeter);
    if (screenY >= -1 && screenY <= displayHeight + 1) {
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(displayWidth, screenY);
      ctx.stroke();
    }
  }

  // Draw grid intersection markers for better visibility
  if (zoom > 1.5) {
    ctx.fillStyle = `rgba(156, 163, 175, ${opacity * 0.6})`;
    const markerSize = 2;
    
    for (let meterX = startXMeter; meterX <= endXMeter; meterX += gridSize) {
      for (let meterY = startYMeter; meterY <= endYMeter; meterY += gridSize) {
        const screenX = offsetX + (meterX * pixelsPerMeter);
        const screenY = offsetY - (meterY * pixelsPerMeter);
        
        if (screenX >= -markerSize && screenX <= displayWidth + markerSize &&
            screenY >= -markerSize && screenY <= displayHeight + markerSize) {
          ctx.fillRect(screenX - markerSize / 2, screenY - markerSize / 2, markerSize, markerSize);
        }
      }
    }
  }

  // Highlight specific intersection if provided
  if (highlightIntersection) {
    const screenX = offsetX + (highlightIntersection.x * pixelsPerMeter);
    const screenY = offsetY - (highlightIntersection.y * pixelsPerMeter);
    
    if (screenX >= -20 && screenX <= displayWidth + 20 &&
        screenY >= -20 && screenY <= displayHeight + 20) {
      // Draw highlight circle
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw crosshair
      ctx.strokeStyle = 'rgba(34, 197, 94, 1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(screenX - 12, screenY);
      ctx.lineTo(screenX + 12, screenY);
      ctx.moveTo(screenX, screenY - 12);
      ctx.lineTo(screenX, screenY + 12);
      ctx.stroke();
    }
  }
};
