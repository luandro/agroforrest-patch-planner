
import { useEffect, useRef } from 'react';
import { CanvasViewport } from '../types/canvas.types';

interface UseCanvasInitializationProps {
  updateViewport: (updates: Partial<CanvasViewport>) => void;
  beds: any[];
}

export const useCanvasInitialization = ({
  updateViewport,
  beds
}: UseCanvasInitializationProps) => {
  const isInitialized = useRef(false);

  // Initialize viewport to home position only once
  useEffect(() => {
    if (!isInitialized.current) {
      // Reset to home position on page load
      updateViewport({
        centerX: 0,
        centerY: 0,
        zoom: 1
      });
      
      isInitialized.current = true;
      console.log('Canvas initialized to home position');
    }
  }, []); // Empty dependency array - run only once

  // Auto-fit when first beds are added
  useEffect(() => {
    if (beds.length === 1 && isInitialized.current) {
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
  }, [beds.length, updateViewport]); // Only depend on beds.length and updateViewport
};
