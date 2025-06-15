
import { useCallback } from 'react';
import { useBedFocus } from './useBedFocus';
import { CanvasViewport } from '../types/canvas.types';

interface UseCanvasFocusModeProps {
  viewport: CanvasViewport;
  updateViewport: (updates: Partial<CanvasViewport>) => void;
}

export const useCanvasFocusMode = ({
  viewport,
  updateViewport
}: UseCanvasFocusModeProps) => {
  const { 
    focusMode, 
    isInFocusMode, 
    focusedBedId, 
    enterFocusMode, 
    exitFocusMode 
  } = useBedFocus({
    viewport,
    updateViewport
  });

  const handleEnterFocus = useCallback((bedId: string) => {
    enterFocusMode(bedId);
  }, [enterFocusMode]);

  const handleExitFocus = useCallback(() => {
    exitFocusMode();
  }, [exitFocusMode]);

  return {
    focusMode,
    isInFocusMode,
    focusedBedId,
    handleEnterFocus,
    handleExitFocus
  };
};
