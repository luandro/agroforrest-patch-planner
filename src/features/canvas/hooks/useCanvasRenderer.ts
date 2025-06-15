import { useCallback, useRef } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { drawGrid } from '../utils/gridRenderer';
import { drawBed } from '../utils/shapeRenderer';
import { drawPlantPlacements } from '../utils/plantRenderer';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

interface UseCanvasRendererProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  gridSize: number;
  spacing?: number;
  focusedBed?: Bed | null;
}

export const useCanvasRenderer = ({ canvasRef, gridSize, spacing = 0.4, focusedBed }: UseCanvasRendererProps) => {
  const animationFrameRef = useRef<number>();
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use provided canvasRef or internal one
  const activeCanvasRef = canvasRef || internalCanvasRef;

  // Get plant placement data
  const { getPlacementsForBed, selectedPlacementIds, placementPreview } = usePlantPlacementStore();

  // DEBUG: Log whenever render fires
  const render = useCallback((
    viewport, beds = [], selectedBedIds = [], previewBed, placementBed, previewBeds, placementBeds, hasCollision
  ) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[useCanvasRenderer:render] focusedBed:", focusedBed);
    }

    const canvas = activeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Set background
    ctx.fillStyle = focusedBed ? '#F0FDF4' : '#F9FAFB'; // Slightly green background in focus mode
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw grid with fine grid for focused bed
    let snapHighlight: { x: number; y: number } | undefined;
    
    // Show snap highlight for preview or placement bed (use first bed for position)
    if (previewBeds && previewBeds.length > 0) {
      snapHighlight = previewBeds[0].position;
    } else if (previewBed) {
      snapHighlight = previewBed.position;
    } else if (placementBeds && placementBeds.length > 0) {
      snapHighlight = placementBeds[0].position;
    } else if (placementBed) {
      snapHighlight = placementBed.position;
    }
    
    drawGrid(ctx, viewport, gridSize, snapHighlight, focusedBed);

    // 4. Draw placed beds and their plants
    beds.forEach(bed => {
      const isSelected = selectedBedIds.includes(bed.id);
      const isFocused = focusedBed?.id === bed.id;
      
      // In focus mode, only draw the focused bed
      if (focusedBed && !isFocused) {
        return; 
      }
      
      // In focus mode, hide spacing
      const bedSpacing = focusedBed ? 0 : spacing;
      
      drawBed(ctx, bed, viewport, isSelected, false, false, bedSpacing);
      
      // 5. Draw plant placements for this bed
      const bedPlacements = getPlacementsForBed(bed.id);
      if (bedPlacements.length > 0) {
        drawPlantPlacements(
          ctx, 
          bed, 
          bedPlacements, 
          viewport, 
          isFocused ? selectedPlacementIds : [],
          isFocused ? placementPreview : null
        );
      }
    });

    // 6. Draw placement beds if they exist (confirmed beds awaiting creation)
    const finalPlacementBeds = placementBeds || (placementBed ? [placementBed] : []);
    finalPlacementBeds.forEach(bed => {
      drawBed(ctx, bed, viewport, false, false, true, focusedBed ? 0 : spacing, hasCollision);
    });

    // 7. Draw preview beds if they exist (follows cursor)
    const finalPreviewBeds = previewBeds || (previewBed ? [previewBed] : []);
    finalPreviewBeds.forEach(bed => {
      drawBed(ctx, bed, viewport, false, true, false, focusedBed ? 0 : spacing, hasCollision);
    });

    // 8. Draw collision indicators if there are collisions
    if (hasCollision && (finalPreviewBeds.length > 0 || finalPlacementBeds.length > 0)) {
      drawCollisionIndicators(ctx, viewport, finalPreviewBeds.concat(finalPlacementBeds));
    }
  }, [activeCanvasRef, gridSize, spacing, focusedBed, getPlacementsForBed, selectedPlacementIds, placementPreview]);

  // Helper function to draw collision indicators
  const drawCollisionIndicators = (ctx: CanvasRenderingContext2D, viewport: CanvasViewport, beds: Bed[]) => {
    ctx.save();
    
    beds.forEach(bed => {
      const pixelsPerMeter = 50 * viewport.zoom;
      const displayWidth = ctx.canvas.width / (window.devicePixelRatio || 1);
      const displayHeight = ctx.canvas.height / (window.devicePixelRatio || 1);
      
      const screenX = (displayWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
      const screenY = (displayHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;
      
      // Draw warning icon
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️', screenX, screenY - 30);
      
      // Draw warning text
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.font = 'bold 12px sans-serif';
      const warningText = 'COLISÃO';
      ctx.strokeText(warningText, screenX, screenY - 10);
      ctx.fillText(warningText, screenX, screenY - 10);
    });
    
    ctx.restore();
  };

  const scheduleRender = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBed?: Bed | null,
    placementBed?: Bed | null,
    previewBeds?: Bed[],
    placementBeds?: Bed[],
    hasCollision?: boolean
  ) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      render(viewport, beds, selectedBedIds, previewBed, placementBed, previewBeds, placementBeds, hasCollision);
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
