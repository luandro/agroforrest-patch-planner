
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';
import { drawPlant, drawSelectionArea } from './plants/plantDrawing';
import { drawBulkPreviewPlant } from './plants/bulkPreviewRenderer';
import { calculatePlantScreenPosition } from './plants/plantPositioning';
import { createBedClippingPath } from './plants/bedClipping';

export const drawPlantPlacements = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  placements: PlantPlacement[],
  viewport: CanvasViewport,
  selectedPlacementIds: string[] = [],
  placementPreview?: { x: number; y: number } | null,
  hoveredPlacementId?: string | null,
  selectionArea?: { startX: number; startY: number; endX: number; endY: number } | null,
  growthMonth?: number
) => {
  const canvas = ctx.canvas;
  const pixelsPerMeter = 50 * viewport.zoom;
  
  // Calculate display dimensions
  const displayWidth = canvas.width / (window.devicePixelRatio || 1);
  const displayHeight = canvas.height / (window.devicePixelRatio || 1);
  
  // Calculate bed screen position
  const bedScreenX = (displayWidth / 2) + (bed.position.x - viewport.centerX) * pixelsPerMeter;
  const bedScreenY = (displayHeight / 2) - (bed.position.y - viewport.centerY) * pixelsPerMeter;

  // Create clipping path for bed shape
  ctx.save();
  createBedClippingPath(ctx, bed, bedScreenX, bedScreenY, pixelsPerMeter);

  // Draw existing placements with growth timeline
  placements.forEach(placement => {
    const { x: plantScreenX, y: plantScreenY } = calculatePlantScreenPosition(
      bedScreenX, 
      bedScreenY, 
      placement.position, 
      pixelsPerMeter
    );
    
    const isSelected = selectedPlacementIds.includes(placement.id);
    const isHovered = hoveredPlacementId === placement.id;
    
    // Enhanced plant drawing with timeline growth
    drawPlant(
      ctx, 
      plantScreenX, 
      plantScreenY, 
      placement.species, 
      isSelected, 
      false, 
      isHovered,
      growthMonth
    );
  });

  // Draw bulk placement preview if active
  const bulkStore = useBulkPlacementStore.getState();
  if (bulkStore.showPreview && bulkStore.preview && bulkStore.selectedBed?.id === bed.id) {
    bulkStore.preview.positions.forEach(position => {
      const { x: previewScreenX, y: previewScreenY } = calculatePlantScreenPosition(
        bedScreenX, 
        bedScreenY, 
        position, 
        pixelsPerMeter
      );
      
      drawBulkPreviewPlant(ctx, previewScreenX, previewScreenY, bulkStore.selectedSpecies, position);
    });
  }

  // Draw individual placement preview
  if (placementPreview) {
    const { x: previewScreenX, y: previewScreenY } = calculatePlantScreenPosition(
      bedScreenX, 
      bedScreenY, 
      placementPreview, 
      pixelsPerMeter
    );
    
    drawPlant(ctx, previewScreenX, previewScreenY, null, false, true, false, growthMonth);
  }

  ctx.restore();

  // Draw enhanced selection area outside of clipping (so it shows over bed boundaries)
  if (selectionArea) {
    drawSelectionArea(
      ctx,
      selectionArea.startX,
      selectionArea.startY,
      selectionArea.endX,
      selectionArea.endY
    );
  }
};

// Re-export positioning utilities for backwards compatibility
export { getPlantAtPosition } from './plants/plantPositioning';
