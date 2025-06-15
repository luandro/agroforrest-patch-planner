
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

  // Handle entering focus mode with immediate viewport animation
  const handleEnterFocus = useCallback((bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;

    // Calculate target viewport to show bed filling 80% of view
    const padding = 0.2; // 20% total padding (10% each side)
    let bedWidth, bedHeight;
    
    if (bed.shape === 'rectangle') {
      bedWidth = bed.dimensions.length || 1;
      bedHeight = bed.dimensions.width || 1;
    } else {
      const radius = bed.dimensions.radius || 0.5;
      bedWidth = bedHeight = radius * 2;
    }
    
    // Add some extra padding for the fine grid visibility
    const targetWidth = bedWidth / (1 - padding);
    const targetHeight = bedHeight / (1 - padding);
    
    // Calculate zoom to fit bed in viewport (assuming 20m base viewport)
    const zoomX = 20 / targetWidth;
    const zoomY = 20 / targetHeight;
    const targetZoom = Math.min(zoomX, zoomY) * 0.9; // 90% to ensure some padding
    
    const finalZoom = Math.max(2, Math.min(8, targetZoom)); // Clamp between 2x and 8x

    // Enter focus mode first
    enterFocusMode(bedId);
    
    // Then animate to target viewport
    const startTime = performance.now();
    const duration = 500; // 500ms animation
    
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
    onFocusEnter?.(bedId);
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
