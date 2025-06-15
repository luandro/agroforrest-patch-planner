
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { PlantPlacement } from '../stores/plantPlacementStore';
import { useBulkPlacementStore } from '../stores/bulkPlacementStore';
import { drawPlant } from './plants/plantDrawing';
import { drawBulkPreviewPlant } from './plants/bulkPreviewRenderer';
import { calculatePlantScreenPosition } from './plants/plantPositioning';
import { createBedClippingPath } from './plants/bedClipping';

export const drawPlantPlacements = (
  ctx: CanvasRenderingContext2D,
  bed: Bed,
  placements: PlantPlacement[],
  viewport: CanvasViewport,
  selectedPlacementIds: string[] = [],
  placementPreview?: { x: number; y: number } | null
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

  // Draw existing placements
  placements.forEach(placement => {
    const { x: plantScreenX, y: plantScreenY } = calculatePlantScreenPosition(
      bedScreenX, 
      bedScreenY, 
      placement.position, 
      pixelsPerMeter
    );
    
    const isSelected = selectedPlacementIds.includes(placement.id);
    
    drawPlant(ctx, plantScreenX, plantScreenY, placement.species, isSelected, false);
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
    
    drawPlant(ctx, previewScreenX, previewScreenY, null, false, true);
  }

  ctx.restore();
};

// Re-export positioning utilities for backwards compatibility
export { getPlantAtPosition } from './plants/plantPositioning';
