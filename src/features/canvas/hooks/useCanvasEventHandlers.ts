
import { useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasTool } from '../types/bed.types';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { usePlantPlacement } from './usePlantPlacement';

interface UseCanvasEventHandlersProps {
  tool: CanvasTool;
  isCreating: boolean;
  multiCreationMode: boolean;
  startPreview: (x: number, y: number) => void;
  updatePreview: (x: number, y: number) => void;
  placeBed: () => void;
  startSelection: (x: number, y: number, isMultiSelect: boolean) => void;
  updateSelection: (x: number, y: number) => void;
  finishSelection: () => void;
  handleToolChange: (tool: CanvasTool) => void;
  // Plant placement props
  viewport?: any;
  focusedBed?: any;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useCanvasEventHandlers = ({
  tool,
  isCreating,
  multiCreationMode,
  startPreview,
  updatePreview,
  placeBed,
  startSelection,
  updateSelection,
  finishSelection,
  handleToolChange,
  viewport,
  focusedBed,
  canvasRef
}: UseCanvasEventHandlersProps) => {
  const isMobile = useIsMobile();
  const { isPlacing } = usePlantPlacementStore();
  
  // Plant placement hook
  const {
    handlePlacementPreview,
    handlePlantPlacement,
    handleEmptyAreaClick
  } = usePlantPlacement({
    viewport,
    focusedBed,
    canvasRef
  });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle plant placement in focus mode
    if (focusedBed && isPlacing) {
      handlePlantPlacement(x, y);
      return;
    }

    if (tool === 'create-rectangle' || tool === 'create-circle') {
      startPreview(x, y);
    } else if (tool === 'select') {
      const isMultiSelect = e.shiftKey || e.ctrlKey;
      startSelection(x, y, isMultiSelect);
    }
    
    // Handle empty area clicks to cancel placement
    if (tool === 'pan' && isPlacing) {
      handleEmptyAreaClick();
    }
  }, [tool, startPreview, startSelection, focusedBed, isPlacing, handlePlantPlacement, handleEmptyAreaClick]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle plant placement preview in focus mode
    if (focusedBed && isPlacing) {
      handlePlacementPreview(x, y);
      return;
    }

    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      updatePreview(x, y);
    } else {
      updateSelection(x, y);
    }
  }, [isCreating, tool, updatePreview, updateSelection, focusedBed, isPlacing, handlePlacementPreview]);

  const handlePointerUp = useCallback(() => {
    // Don't handle pointer up for plant placement
    if (focusedBed && isPlacing) {
      return;
    }

    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      placeBed();
    } else {
      finishSelection();
    }
  }, [isCreating, tool, placeBed, finishSelection, focusedBed, isPlacing]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    // Don't handle double click for plant placement
    if (focusedBed && isPlacing) {
      return;
    }

    if (isMobile && tool === 'pan') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      startPreview(x, y);
      setTimeout(() => {
        placeBed();
      }, 10);
    }
  }, [isMobile, tool, startPreview, placeBed, focusedBed, isPlacing]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  };
};
