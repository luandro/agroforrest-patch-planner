
import { useCallback, useRef, useEffect } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { Bed } from '../types/bed.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { renderCanvas } from '../utils/renderOrchestrator';
import { useAnimationScheduler } from '../utils/animationScheduler';
import { useTimelineStore } from '../stores/timelineStore';

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

  const { isTimelineActive, currentMonth } = useTimelineStore();

  // Track timeline changes and force re-render
  const lastTimelineState = useRef({ isTimelineActive, currentMonth });
  
  useEffect(() => {
    const hasTimelineChanged = 
      lastTimelineState.current.isTimelineActive !== isTimelineActive ||
      lastTimelineState.current.currentMonth !== currentMonth;
    
    if (hasTimelineChanged) {
      console.log('[Timeline] State changed:', { 
        wasActive: lastTimelineState.current.isTimelineActive, 
        nowActive: isTimelineActive,
        wasMonth: lastTimelineState.current.currentMonth,
        nowMonth: currentMonth
      });
      
      lastTimelineState.current = { isTimelineActive, currentMonth };
      
      // Force a re-render when timeline state changes
      const canvas = activeCanvasRef.current;
      if (canvas) {
        // Trigger a re-render with current state
        const event = new CustomEvent('timelineStateChanged');
        canvas.dispatchEvent(event);
      }
    }
  }, [isTimelineActive, currentMonth, activeCanvasRef]);

  // Enhanced render function with timeline debugging
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
    const timelineMonth = isTimelineActive ? currentMonth : undefined;
    
    if (process.env.NODE_ENV === "development") {
      console.debug("[Canvas Render]", {
        focusedBed: focusedBed?.id,
        timelineActive: isTimelineActive,
        currentMonth: timelineMonth,
        plantsCount: focusedBed ? getPlacementsForBed(focusedBed.id).length : 0
      });
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
      placementPreview,
      growthMonth: timelineMonth
    });
  }, [activeCanvasRef, gridSize, spacing, focusedBed, getPlacementsForBed, selectedPlacementIds, placementPreview, isTimelineActive, currentMonth]);

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
