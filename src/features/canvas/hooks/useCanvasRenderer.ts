
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

  // Track timeline changes and force re-render with improved detection
  const lastTimelineState = useRef({ isTimelineActive, currentMonth });
  
  useEffect(() => {
    const hasTimelineChanged = 
      lastTimelineState.current.isTimelineActive !== isTimelineActive ||
      Math.abs(lastTimelineState.current.currentMonth - currentMonth) > 0.1; // Detect small changes
    
    if (hasTimelineChanged) {
      console.log('[Canvas Renderer] Timeline state changed:', { 
        wasActive: lastTimelineState.current.isTimelineActive, 
        nowActive: isTimelineActive,
        wasMonth: lastTimelineState.current.currentMonth,
        nowMonth: currentMonth,
        monthDiff: Math.abs(lastTimelineState.current.currentMonth - currentMonth)
      });
      
      lastTimelineState.current = { isTimelineActive, currentMonth };
      
      // Force immediate re-render when timeline state changes
      const canvas = activeCanvasRef.current;
      if (canvas) {
        // Trigger immediate render instead of waiting for next frame
        requestAnimationFrame(() => {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            console.log('[Canvas] Forcing timeline render with month:', currentMonth);
          }
        });
      }
    }
  }, [isTimelineActive, currentMonth, activeCanvasRef]);

  // Enhanced render function with timeline debugging and proper plant sizing
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
    
    // Enhanced logging for debugging plant growth
    if (process.env.NODE_ENV === "development") {
      const totalPlants = focusedBed ? getPlacementsForBed(focusedBed.id).length : 
                          beds.reduce((total, bed) => total + getPlacementsForBed(bed.id).length, 0);
      
      console.debug("[Canvas Render]", {
        focusedBed: focusedBed?.id,
        timelineActive: isTimelineActive,
        currentMonth: timelineMonth,
        plantsCount: totalPlants,
        viewport: {
          zoom: viewport.zoom,
          center: `${viewport.centerX}, ${viewport.centerY}`
        }
      });
    }

    const canvas = activeCanvasRef.current;
    if (!canvas) {
      console.warn('[Canvas] No canvas ref available for render');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('[Canvas] No canvas context available for render');
      return;
    }

    // Enhanced canvas clearing and sizing
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Ensure canvas is properly sized
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    }

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
      growthMonth: timelineMonth // Ensure growth month is passed correctly
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
