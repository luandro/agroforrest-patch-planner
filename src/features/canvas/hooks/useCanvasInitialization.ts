
import { useEffect } from 'react';
import { CanvasViewport } from '../types/canvas.types';

interface UseCanvasInitializationProps {
  updateViewport: (updates: Partial<CanvasViewport>) => void;
  beds: any[];
}

export const useCanvasInitialization = ({
  updateViewport,
  beds
}: UseCanvasInitializationProps) => {
  // Initialize viewport to home position
  useEffect(() => {
    // Reset to home position on page load
    updateViewport({
      centerX: 0,
      centerY: 0,
      zoom: 1
    });
    
    console.log('Canvas initialized to home position');
  }, [updateViewport]);

  // Auto-fit when first beds are added
  useEffect(() => {
    if (beds.length === 1) {
      // Small delay to ensure bed is rendered
      setTimeout(() => {
        // Center on the first bed
        const firstBed = beds[0];
        updateViewport({
          centerX: firstBed.position.x,
          centerY: firstBed.position.y,
          zoom: 2
        });
      }, 100);
    }
  }, [beds.length, beds, updateViewport]);
};
