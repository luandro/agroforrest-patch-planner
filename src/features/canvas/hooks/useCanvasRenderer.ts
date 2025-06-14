
import { useCallback, useRef } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { drawGrid } from '../utils/gridRenderer';
import { drawBed } from '../utils/shapeRenderer';

interface UseCanvasRendererProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  gridSize: number;
  spacing?: number;
}

export const useCanvasRenderer = ({ canvasRef, gridSize, spacing = 0.4 }: UseCanvasRendererProps) => {
  const animationFrameRef = useRef<number>();
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use provided canvasRef or internal one
  const activeCanvasRef = canvasRef || internalCanvasRef;

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

    // 3. Draw grid with snap indicator
    let snapHighlight: { x: number; y: number } | undefined;
    
    // Show snap highlight for preview or placement bed
    if (previewBed) {
      snapHighlight = previewBed.position;
    } else if (placementBed) {
      snapHighlight = placementBed.position;
    }
    
    drawGrid(ctx, viewport, gridSize, snapHighlight);

    // 4. Draw all beds with spacing
    beds.forEach(bed => {
      const isSelected = selectedBedIds.includes(bed.id);
      drawBed(ctx, bed, viewport, isSelected, false, false, spacing);
    });

    // 5. Draw placement bed if it exists (confirmed bed awaiting creation)
    if (placementBed) {
      drawBed(ctx, placementBed, viewport, false, false, true, spacing);
    }

    // 6. Draw preview bed if it exists (follows cursor)
    if (previewBed) {
      drawBed(ctx, previewBed, viewport, false, true, false, spacing);
    }
  }, [activeCanvasRef, gridSize, spacing]);

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
