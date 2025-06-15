
import { useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasTool } from '../types/bed.types';

interface UseCanvasDoubleClickProps {
  tool: CanvasTool;
  focusedBed?: any;
  isPlacing: boolean;
  startPreview: (x: number, y: number) => void;
  placeBed: () => void;
  getPlantAtCanvasPosition: (x: number, y: number) => any;
  handlePlantSelection: (x: number, y: number, isMultiSelect: boolean) => boolean;
}

export const useCanvasDoubleClick = ({
  tool,
  focusedBed,
  isPlacing,
  startPreview,
  placeBed,
  getPlantAtCanvasPosition,
  handlePlantSelection
}: UseCanvasDoubleClickProps) => {
  const isMobile = useIsMobile();

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle focus mode interactions
    if (focusedBed) {
      if (isPlacing) {
        return; // No double-click action in planting mode
      } else {
        // Double-click plant to enter quick edit mode
        const plant = getPlantAtCanvasPosition(x, y);
        if (plant) {
          // Select the plant and trigger edit mode
          handlePlantSelection(x, y, false);
          // The edit panel will appear automatically when plant is selected
          return;
        }
      }
    }

    // Regular mobile double-tap to place bed
    if (isMobile && tool === 'pan') {
      startPreview(x, y);
      setTimeout(() => {
        placeBed();
      }, 10);
    }
  }, [
    isMobile, 
    tool, 
    startPreview, 
    placeBed, 
    focusedBed, 
    isPlacing,
    getPlantAtCanvasPosition,
    handlePlantSelection
  ]);

  return { handleDoubleClick };
};
