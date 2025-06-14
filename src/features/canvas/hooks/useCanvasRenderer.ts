import { useCallback, useRef } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';

interface UseCanvasRendererProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  gridSize: number;
}

export const useCanvasRenderer = ({ canvasRef, gridSize }: UseCanvasRendererProps) => {
  const animationFrameRef = useRef<number>();
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use provided canvasRef or internal one
  const activeCanvasRef = canvasRef || internalCanvasRef;

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, viewport: CanvasViewport) => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return;

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
  }, [activeCanvasRef, gridSize]);

  const drawBed = useCallback((
    ctx: CanvasRenderingContext2D, 
    bed: Bed, 
    viewport: CanvasViewport,
    isSelected: boolean = false,
    isPreview: boolean = false,
    isPlacement: boolean = false
  ) => {
    const pixelsPerMeter = 50 * viewport.zoom;
    const canvasWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
    
    // Convert world coordinates to screen coordinates
    const screenX = (canvasWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
    const screenY = (canvasHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;

    ctx.save();

    // Set styles based on bed state
    if (isPreview) {
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; // Green preview
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
    } else if (isPlacement) {
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = '#16A34A'; // Solid green for placement
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      // Add glow effect
      ctx.shadowColor = '#16A34A';
      ctx.shadowBlur = 10;
    } else {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#D4A574'; // Light brown for beds
      ctx.strokeStyle = isSelected ? '#0EA5E9' : '#92400E'; // Blue if selected, dark brown otherwise
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash([]);
    }

    if (bed.shape === 'rectangle') {
      const length = (bed.dimensions.length || 0) * pixelsPerMeter;
      const width = (bed.dimensions.width || 0) * pixelsPerMeter;
      
      ctx.fillRect(screenX - length / 2, screenY - width / 2, length, width);
      ctx.strokeRect(screenX - length / 2, screenY - width / 2, length, width);
      
      // Draw dimensions text for preview and placement
      if (isPreview || isPlacement) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        
        const dimensionText = `${bed.dimensions.length}m × ${bed.dimensions.width}m`;
        const textY = screenY + 5;
        
        // Text with stroke for better visibility
        ctx.strokeText(dimensionText, screenX, textY);
        ctx.fillText(dimensionText, screenX, textY);
        ctx.restore();
      }
      
      // Draw resize handles if selected
      if (isSelected && !isPreview) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0EA5E9';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        
        const handleSize = 8;
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
      }
    } else {
      const radius = (bed.dimensions.radius || 0) * pixelsPerMeter;
      
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw dimensions text for preview and placement
      if (isPreview || isPlacement) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        
        const dimensionText = `⌀ ${(bed.dimensions.radius! * 2).toFixed(1)}m`;
        const textY = screenY + 5;
        
        // Text with stroke for better visibility
        ctx.strokeText(dimensionText, screenX, textY);
        ctx.fillText(dimensionText, screenX, textY);
        ctx.restore();
      }
      
      // Draw resize handle if selected
      if (isSelected && !isPreview) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0EA5E9';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        
        const handleSize = 8;
        ctx.fillRect(screenX + radius - handleSize / 2, screenY - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(screenX + radius - handleSize / 2, screenY - handleSize / 2, handleSize, handleSize);
      }
    }

    ctx.restore();
  }, []);

  const render = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBed?: Bed | null,
    placementBed?: Bed | null
  ) => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Set background
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw grid
    drawGrid(ctx, viewport);

    // 4. Draw all beds
    beds.forEach(bed => {
      const isSelected = selectedBedIds.includes(bed.id);
      drawBed(ctx, bed, viewport, isSelected, false, false);
    });

    // 5. Draw placement bed if it exists (confirmed bed awaiting creation)
    if (placementBed) {
      drawBed(ctx, placementBed, viewport, false, false, true);
    }

    // 6. Draw preview bed if it exists (follows cursor)
    if (previewBed) {
      drawBed(ctx, previewBed, viewport, false, true, false);
    }
  }, [activeCanvasRef, drawGrid, drawBed]);

  const scheduleRender = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBed?: Bed | null,
    placementBed?: Bed | null
  ) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      render(viewport, beds, selectedBedIds, previewBed, placementBed);
    });
  }, [render]);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  return {
    render,
    scheduleRender,
    cleanup,
    canvasRef: activeCanvasRef
  };
};
