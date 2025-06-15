
// Top-level grid renderer, orchestrates base grid, fine grid in focus mode, and highlights

import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { drawBaseGrid } from './baseGridRenderer';
import { drawPlantingGrid } from './plantingGridRenderer';
import { drawGridHighlight } from './gridHighlightRenderer';

/**
 * Orchestrates grid drawing:
 * - Main grid unless in focus mode.
 * - Fine grid inside focused bed, if provided.
 * - Intersection highlight if provided.
 * Behavior and API unchanged from previous monolithic implementation.
 */
export const drawGrid = (
  ctx: CanvasRenderingContext2D, 
  viewport: CanvasViewport, 
  gridSize: number,
  highlightIntersection?: { x: number; y: number },
  focusedBed?: Bed | null
) => {
  // Draw main field grid (hidden if focusing a bed)
  drawBaseGrid({
    ctx,
    viewport,
    gridSize,
    zoom: viewport.zoom,
    focusedBed
  });

  // Fine grid for planting mode (always shows if focused bed exists)
  if (focusedBed) {
    drawPlantingGrid({
      ctx,
      viewport,
      focusedBed,
      zoom: viewport.zoom
    });
  }

  // Highlightable/crosshair/planting dot
  if (highlightIntersection) {
    drawGridHighlight(ctx, viewport, highlightIntersection);
  }
};

