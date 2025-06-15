
import { useCallback, useRef } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { renderCanvas } from '../utils/renderOrchestrator';
import { useAnimationScheduler } from '../utils/animationScheduler';

interface UseCanvasRendererProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  gridSize: number;
  spacing?: number;
  focusedBed?: Bed | null;
}

export const useCanvasRenderer = ({ canvasRef, gridSize, spacing = 0.4, focusedBed }: UseCanvasRendererProps) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use provided canvasRef or internal one
  const activeCanvasRef = canvasRef || internalCanvasRef;

  // Get plant placement data
  const { getPlacementsForBed, selectedPlacementIds, placementPreview } = usePlantPlacementStore();

  // Animation scheduling
  const { scheduleRender: scheduleAnimation, cleanup } = useAnimationScheduler();

  // DEBUG: Log whenever render fires
  const render = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBed?: any,
    placementBed?: any,
    previewBeds?: any[],
    placementBeds?: any[],
    hasCollision?: boolean
  ) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[useCanvasRenderer:render] focusedBed:", focusedBed);
    }

    const canvas = activeCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCanvas({
      ctx,
      canvas,
      viewport,
      beds,
      selectedBedIds,
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
      placementPreview
    });
  }, [activeCanvasRef, gridSize, spacing, focusedBed, getPlacementsForBed, selectedPlacementIds, placementPreview]);

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
    scheduleAnimation(() => {
      render(viewport, beds, selectedBedIds, previewBed, placementBed, previewBeds, placementBeds, hasCollision);
    });
  }, [scheduleAnimation, render]);

  return {
    render,
    scheduleRender,
    cleanup,
    canvasRef: activeCanvasRef
  };
};
