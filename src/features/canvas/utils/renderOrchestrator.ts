/**
 * Main canvas rendering orchestration
 */

import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { drawGrid } from './gridRenderer';
import { drawBed } from './shapeRenderer';
import { drawPlantPlacements } from './plantRenderer';
import { clearCanvas, setCanvasBackground, getSnapHighlight } from './canvasUtils';
import { drawCollisionIndicators } from './collisionRenderer';
import { useTimelineStore } from '../stores/timelineStore';

interface RenderCanvasParams {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  viewport: CanvasViewport;
  beds: Bed[];
  selectedBedIds: string[];
  previewBed?: any;
  placementBed?: any;
  previewBeds?: any[];
  placementBeds?: any[];
  hasCollision?: boolean;
  gridSize: number;
  spacing: number;
  focusedBed?: Bed | null;
  getPlacementsForBed: (bedId: string) => any[];
  selectedPlacementIds: string[];
  placementPreview?: any;
  growthMonth?: number;
}

export const renderCanvas = ({
  ctx,
  canvas,
  viewport,
  beds = [],
  selectedBedIds = [],
  previewBed,
  placementBed,
  previewBeds,
  placementBeds,
  hasCollision,
  gridSize,
  spacing,
  focusedBed,
  getPlacementsForBed,
  selectedPlacementIds,
  placementPreview,
  growthMonth
}: RenderCanvasParams) => {
  // 1. Clear canvas
  clearCanvas(ctx, canvas);
  
  // 2. Set background
  setCanvasBackground(ctx, canvas, focusedBed);

  // 3. Draw grid with fine grid for focused bed
  const snapHighlight = getSnapHighlight(previewBeds, previewBed, placementBeds, placementBed);
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
    
    // 5. Draw plant placements for this bed with timeline data
    if (getPlacementsForBed) {
      const placements = getPlacementsForBed(bed.id);
      if (placements.length > 0) {
        drawPlantPlacements(
          ctx, 
          bed, 
          placements, 
          viewport, 
          isFocused ? selectedPlacementIds : [],
          isFocused ? placementPreview : null,
          undefined, // hoveredPlacementId
          undefined, // selectionArea
          growthMonth
        );
      }
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
};
