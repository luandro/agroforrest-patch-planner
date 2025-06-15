import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

export const drawGrid = (
  ctx: CanvasRenderingContext2D, 
  viewport: CanvasViewport, 
  gridSize: number,
  highlightIntersection?: { x: number; y: number },
  focusedBed?: Bed | null
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
  
  // Draw main grid lines (only if not in focus mode)
  if (!focusedBed) {
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
  }

  // Always draw fine planting grid when focused bed exists
  if (focusedBed) {
    const bedScreenX = offsetX + (focusedBed.position.x * pixelsPerMeter);
    const bedScreenY = offsetY - (focusedBed.position.y * pixelsPerMeter);
    
    let bedBounds: { minX: number; maxX: number; minY: number; maxY: number };
    
    if (focusedBed.shape === 'rectangle') {
      const length = (focusedBed.dimensions.length || 1) * pixelsPerMeter;
      const width = (focusedBed.dimensions.width || 1) * pixelsPerMeter;
      
      bedBounds = {
        minX: bedScreenX - length / 2,
        maxX: bedScreenX + length / 2,
        minY: bedScreenY - width / 2,
        maxY: bedScreenY + width / 2
      };
    } else {
      const radius = (focusedBed.dimensions.radius || 0.5) * pixelsPerMeter;
      
      bedBounds = {
        minX: bedScreenX - radius,
        maxX: bedScreenX + radius,
        minY: bedScreenY - radius,
        maxY: bedScreenY + radius
      };
    }
    
    // Fine grid: 10cm squares - always visible in focus mode
    const fineGridSize = 0.1; // 10cm
    const finePixelSize = pixelsPerMeter * fineGridSize;
    
    // Enhanced visibility for fine grid, more opaque and starts visible earlier
    const fineOpacity = Math.max(0.6, Math.min(1.0, viewport.zoom * 0.3 + 0.3));
    
    // Set style for fine grid - darker green for better contrast
    ctx.strokeStyle = `rgba(21, 128, 61, ${fineOpacity})`; // Darker, more visible green grid
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    
    // Create clipping path for bed shape
    ctx.save();
    ctx.beginPath();
    
    if (focusedBed.shape === 'rectangle') {
      const length = (focusedBed.dimensions.length || 1) * pixelsPerMeter;
      const width = (focusedBed.dimensions.width || 1) * pixelsPerMeter;
      ctx.rect(
        bedScreenX - length / 2, 
        bedScreenY - width / 2, 
        length, 
        width
      );
    } else {
      const radius = (focusedBed.dimensions.radius || 0.5) * pixelsPerMeter;
      ctx.arc(bedScreenX, bedScreenY, radius, 0, 2 * Math.PI);
    }
    
    ctx.clip();
    
    // DEBUG: draw a bright red border showing grid area in dev mode
    if (process.env.NODE_ENV === "development") {
      ctx.save();
      ctx.beginPath();
      if (focusedBed.shape === 'rectangle') {
        const length = (focusedBed.dimensions.length || 1) * pixelsPerMeter;
        const width = (focusedBed.dimensions.width || 1) * pixelsPerMeter;
        ctx.rect(
          bedScreenX - length / 2, 
          bedScreenY - width / 2, 
          length, 
          width
        );
      } else {
        const radius = (focusedBed.dimensions.radius || 0.5) * pixelsPerMeter;
        ctx.arc(bedScreenX, bedScreenY, radius, 0, 2 * Math.PI);
      }
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 3]);
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw fine grid lines
    const startFineMeterX = Math.floor((bedBounds.minX - offsetX) / pixelsPerMeter / fineGridSize) * fineGridSize;
    const endFineMeterX = Math.ceil((bedBounds.maxX - offsetX) / pixelsPerMeter / fineGridSize) * fineGridSize;
    
    for (let meterX = startFineMeterX; meterX <= endFineMeterX; meterX += fineGridSize) {
      const screenX = offsetX + (meterX * pixelsPerMeter);
      if (screenX >= bedBounds.minX - 1 && screenX <= bedBounds.maxX + 1) {
        ctx.beginPath();
        ctx.moveTo(screenX, bedBounds.minY);
        ctx.lineTo(screenX, bedBounds.maxY);
        ctx.stroke();
      }
    }
    
    const startFineMeterY = Math.floor(((-bedBounds.maxY + offsetY) / pixelsPerMeter) / fineGridSize) * fineGridSize;
    const endFineMeterY = Math.ceil(((-bedBounds.minY + offsetY) / pixelsPerMeter) / fineGridSize) * fineGridSize;
    
    for (let meterY = startFineMeterY; meterY <= endFineMeterY; meterY += fineGridSize) {
      const screenY = offsetY - (meterY * pixelsPerMeter);
      if (screenY >= bedBounds.minY - 1 && screenY <= bedBounds.maxY + 1) {
        ctx.beginPath();
        ctx.moveTo(bedBounds.minX, screenY);
        ctx.lineTo(bedBounds.maxX, screenY);
        ctx.stroke();
      }
    }
    
    // Draw grid intersection dots for better visibility, now visible at lower zoom
    if (viewport.zoom > 1.5) {
      ctx.fillStyle = `rgba(21, 128, 61, ${fineOpacity * 0.8})`; // Darker green dots
      const dotSize = 2;
      
      for (let meterX = startFineMeterX; meterX <= endFineMeterX; meterX += fineGridSize) {
        for (let meterY = startFineMeterY; meterY <= endFineMeterY; meterY += fineGridSize) {
          const screenX = offsetX + (meterX * pixelsPerMeter);
          const screenY = offsetY - (meterY * pixelsPerMeter);
          
          if (screenX >= bedBounds.minX && screenX <= bedBounds.maxX &&
              screenY >= bedBounds.minY && screenY <= bedBounds.maxY) {
            ctx.fillRect(screenX - dotSize / 2, screenY - dotSize / 2, dotSize, dotSize);
          }
        }
      }
    }
    
    ctx.restore();
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
