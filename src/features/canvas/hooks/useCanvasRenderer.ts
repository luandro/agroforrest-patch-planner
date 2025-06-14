
import { useCallback, useRef } from 'react';
import { CanvasViewport } from '../types/canvas.types';

interface UseCanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gridSize: number;
}

export const useCanvasRenderer = ({ canvasRef, gridSize }: UseCanvasRendererProps) => {
  const animationFrameRef = useRef<number>();

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, viewport: CanvasViewport) => {
    const canvas = canvasRef.current;
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
  }, [canvasRef, gridSize]);

  const render = useCallback((viewport: CanvasViewport) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, viewport);
  }, [canvasRef, drawGrid]);

  const scheduleRender = useCallback((viewport: CanvasViewport) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      render(viewport);
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
    cleanup
  };
};
