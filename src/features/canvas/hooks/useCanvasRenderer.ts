
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
    previewBeds: Bed[] = [],
    placementBeds: Bed[] = []
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
    
    // Show snap highlight for preview or placement bed (use first bed for snap highlight)
    if (previewBeds.length > 0) {
      snapHighlight = previewBeds[0].position;
    } else if (placementBeds.length > 0) {
      snapHighlight = placementBeds[0].position;
    }
    
    drawGrid(ctx, viewport, gridSize, snapHighlight);

    // 4. Draw all existing beds with spacing
    beds.forEach(bed => {
      const isSelected = selectedBedIds.includes(bed.id);
      drawBed(ctx, bed, viewport, isSelected, false, false, spacing);
    });

    // 5. Draw all placement beds if they exist (confirmed beds awaiting creation)
    placementBeds.forEach(bed => {
      drawBed(ctx, bed, viewport, false, false, true, spacing);
    });

    // 6. Draw all preview beds if they exist (follows cursor)
    previewBeds.forEach(bed => {
      drawBed(ctx, bed, viewport, false, true, false, spacing);
    });
  }, [activeCanvasRef, gridSize, spacing]);

  const scheduleRender = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBeds: Bed[] = [],
    placementBeds: Bed[] = []
  ) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      render(viewport, beds, selectedBedIds, previewBeds, placementBeds);
    });
  }, [render]);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Legacy compatibility - convert single bed to array
  const renderLegacy = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBed?: Bed | null,
    placementBed?: Bed | null
  ) => {
    const previewBeds = previewBed ? [previewBed] : [];
    const placementBeds = placementBed ? [placementBed] : [];
    render(viewport, beds, selectedBedIds, previewBeds, placementBeds);
  }, [render]);

  const scheduleRenderLegacy = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBed?: Bed | null,
    placementBed?: Bed | null
  ) => {
    const previewBeds = previewBed ? [previewBed] : [];
    const placementBeds = placementBed ? [placementBed] : [];
    scheduleRender(viewport, beds, selectedBedIds, previewBeds, placementBeds);
  }, [scheduleRender]);

  return {
    render,
    scheduleRender,
    renderLegacy,
    scheduleRenderLegacy,
    cleanup,
    canvasRef: activeCanvasRef
  };
};
