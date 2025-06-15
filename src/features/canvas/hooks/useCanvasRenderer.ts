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
    ctx.fillStyle = focusedBed ? '#F0FDF4' : '#F9FAFB'; // Slightly green background in focus mode
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw grid with fine grid for focused bed
    let snapHighlight: { x: number; y: number } | undefined;
    
    // Show snap highlight for preview or placement bed
    if (previewBed) {
      snapHighlight = previewBed.position;
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

    // 6. Draw placement bed if it exists (confirmed bed awaiting creation)
    if (placementBed) {
      drawBed(ctx, placementBed, viewport, false, false, true, focusedBed ? 0 : spacing);
    }

    // 7. Draw preview bed if it exists (follows cursor)
    if (previewBed) {
      drawBed(ctx, previewBed, viewport, false, true, false, focusedBed ? 0 : spacing);
    }
  }, [activeCanvasRef, gridSize, spacing, focusedBed, getPlacementsForBed, selectedPlacementIds, placementPreview]);

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
