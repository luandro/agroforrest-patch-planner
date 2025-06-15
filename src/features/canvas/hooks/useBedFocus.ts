
import { useCallback, useEffect } from 'react';
import { useFocusModeStore } from '../stores/focusModeStore';
import { CanvasViewport } from '../types/canvas.types';

interface UseBedFocusProps {
  viewport: CanvasViewport;
  updateViewport: (updates: Partial<CanvasViewport>) => void;
  onFocusEnter?: (bedId: string) => void;
  onFocusExit?: () => void;
}

export const useBedFocus = ({
  viewport,
  updateViewport,
  onFocusEnter,
  onFocusExit
}: UseBedFocusProps) => {
  const { focusMode, enterFocusMode, exitFocusMode } = useFocusModeStore();

  // Handle entering focus mode
  const handleEnterFocus = useCallback((bedId: string) => {
    enterFocusMode(bedId);
    onFocusEnter?.(bedId);
  }, [enterFocusMode, onFocusEnter]);

  // Handle exiting focus mode
  const handleExitFocus = useCallback(() => {
    exitFocusMode();
    onFocusExit?.();
  }, [exitFocusMode, onFocusExit]);

  // Auto-animate to target viewport when focus mode is activated
  useEffect(() => {
    if (focusMode.isActive && focusMode.targetViewport) {
      const targetViewport = focusMode.targetViewport;
      
      // Smooth animation to focused view
      const startTime = performance.now();
      const duration = 500; // 500ms animation
      
      const startViewport = {
        zoom: viewport.zoom,
        centerX: viewport.centerX,
        centerY: viewport.centerY
      };
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeInOutCubic = (t: number) => {
          return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        const easedProgress = easeInOutCubic(progress);
        
        // Interpolate viewport values
        const newZoom = startViewport.zoom + (targetViewport.zoom - startViewport.zoom) * easedProgress;
        const newCenterX = startViewport.centerX + (targetViewport.centerX - startViewport.centerX) * easedProgress;
        const newCenterY = startViewport.centerY + (targetViewport.centerY - startViewport.centerY) * easedProgress;
        
        updateViewport({
          zoom: newZoom,
          centerX: newCenterX,
          centerY: newCenterY
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [focusMode.isActive, focusMode.targetViewport, updateViewport]);

  return {
    focusMode,
    isInFocusMode: focusMode.isActive,
    focusedBedId: focusMode.bedId,
    enterFocusMode: handleEnterFocus,
    exitFocusMode: handleExitFocus
  };
};
