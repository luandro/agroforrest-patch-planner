
import { useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasTool } from '../types/bed.types';

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
  handleToolChange
}: UseCanvasEventHandlersProps) => {
  const isMobile = useIsMobile();

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'create-rectangle' || tool === 'create-circle') {
      startPreview(x, y);
    } else if (tool === 'select') {
      const isMultiSelect = e.shiftKey || e.ctrlKey;
      startSelection(x, y, isMultiSelect);
    }
  }, [tool, startPreview, startSelection]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      updatePreview(x, y);
    } else {
      updateSelection(x, y);
    }
  }, [isCreating, tool, updatePreview, updateSelection]);

  const handlePointerUp = useCallback(() => {
    if (isCreating && (tool === 'create-rectangle' || tool === 'create-circle')) {
      placeBed();
    } else {
      finishSelection();
    }
  }, [isCreating, tool, placeBed, finishSelection]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (isMobile && tool === 'pan') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      startPreview(x, y);
      setTimeout(() => {
        placeBed();
      }, 10);
    }
  }, [isMobile, tool, startPreview, placeBed]);

  const handleConfirmPlacement = useCallback(() => {
    // This will be passed from the orchestrator
  }, []);

  const handleCancelPlacement = useCallback(() => {
    // This will be passed from the orchestrator
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    handleConfirmPlacement,
    handleCancelPlacement
  };
};
