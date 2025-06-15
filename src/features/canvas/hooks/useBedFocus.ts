
import { useCallback, useEffect } from 'react';
import { useFocusModeStore } from '../stores/focusModeStore';
import { useBedStore } from '../stores/bedStore';
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
  const { beds } = useBedStore();

  // Handle entering focus mode with smooth viewport animation
  const handleEnterFocus = useCallback((bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;

    // Enter focus mode first for immediate state change
    enterFocusMode(bedId);
    
    // Calculate optimal target viewport
    const padding = 0.15; // 15% padding around bed
    let bedWidth, bedHeight;
    
    if (bed.shape === 'rectangle') {
      bedWidth = bed.dimensions.length || 1;
      bedHeight = bed.dimensions.width || 1;
    } else {
      const radius = bed.dimensions.radius || 0.5;
      bedWidth = bedHeight = radius * 2;
    }
    
    // Add padding to ensure fine grid is visible
    const targetWidth = bedWidth / (1 - padding * 2);
    const targetHeight = bedHeight / (1 - padding * 2);
    
    // Calculate zoom to fit bed in viewport with 10m base viewport
    const baseViewportSize = 10;
    const zoomX = baseViewportSize / targetWidth;
    const zoomY = baseViewportSize / targetHeight;
    const targetZoom = Math.min(zoomX, zoomY);
    
    // Clamp zoom for usability (minimum 3x for fine grid visibility)
    const finalZoom = Math.max(3, Math.min(8, targetZoom));

    // Smooth animation to target position
    const startTime = performance.now();
    const duration = 600; // Slightly longer for smoothness
    
    const startViewport = {
      zoom: viewport.zoom,
      centerX: viewport.centerX,
      centerY: viewport.centerY
    };
    
    const targetViewport = {
      zoom: finalZoom,
      centerX: bed.position.x,
      centerY: bed.position.y
    };
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeInOutQuart = (t: number) => {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      };
      
      const easedProgress = easeInOutQuart(progress);
      
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
      } else {
        // Animation complete, trigger callback
        onFocusEnter?.(bedId);
      }
    };
    
    requestAnimationFrame(animate);
  }, [beds, enterFocusMode, viewport, updateViewport, onFocusEnter]);

  // Handle exiting focus mode
  const handleExitFocus = useCallback(() => {
    exitFocusMode();
    onFocusExit?.();
  }, [exitFocusMode, onFocusExit]);

  return {
    focusMode,
    isInFocusMode: focusMode.isActive,
    focusedBedId: focusMode.bedId,
    enterFocusMode: handleEnterFocus,
    exitFocusMode: handleExitFocus
  };
};
