
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
  const activeCanvasRef = canvasRef || internalCanvasRef;

  // Get plant placement data
  const { getPlacementsForBed, selectedPlacementIds, placementPreview } = usePlantPlacementStore();

  // Animation scheduling
  const { scheduleRender: scheduleAnimation, cleanup } = useAnimationScheduler();

  const { isTimelineActive, currentMonth } = useTimelineStore();

  // Track timeline changes for forced re-renders
  const lastRenderData = useRef({ 
    isTimelineActive, 
    currentMonth,
    timestamp: Date.now()
  });
  
  useEffect(() => {
    const hasTimelineChanged = 
      lastRenderData.current.isTimelineActive !== isTimelineActive ||
      Math.abs(lastRenderData.current.currentMonth - currentMonth) > 0.01;
    
    if (hasTimelineChanged) {
      console.log('[Canvas Renderer] Timeline changed, forcing render:', { 
        wasActive: lastRenderData.current.isTimelineActive, 
        nowActive: isTimelineActive,
        wasMonth: lastRenderData.current.currentMonth.toFixed(2),
        nowMonth: currentMonth.toFixed(2)
      });
      
      lastRenderData.current = { isTimelineActive, currentMonth, timestamp: Date.now() };
      
      // Force immediate re-render
      requestAnimationFrame(() => {
        const canvas = activeCanvasRef.current;
        if (canvas) {
          console.log('[Canvas] Immediate timeline render triggered');
        }
      });
    }
  }, [isTimelineActive, currentMonth, activeCanvasRef]);

  // Enhanced render function with proper timeline integration
  const render = useCallback((
    viewport: CanvasViewport, 
    beds: Bed[] = [], 
    selectedBedIds: string[] = [], 
    previewBed?: Bed | null,
    placementBed?: Bed | null,
    previewBeds?: Bed[],
    placementBeds?: Bed[],
    hasCollision?: boolean
  ) => {
    // Always pass current timeline data to renderer
    const growthMonth = isTimelineActive ? currentMonth : undefined;
    
    console.log('[Canvas Render] Rendering with timeline data:', {
      isTimelineActive,
      growthMonth,
      bedsCount: beds.length,
      focusedBed: focusedBed?.id
    });

    const canvas = activeCanvasRef.current;
    if (!canvas) {
      console.warn('[Canvas] No canvas ref available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('[Canvas] No canvas context available');
      return;
    }

    // Ensure proper canvas sizing
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    }

    // Render with timeline data
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
      growthMonth // Critical: pass growth month to renderer
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
