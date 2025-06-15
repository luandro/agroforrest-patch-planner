
import { useEffect } from 'react';
import { useBedStore } from '../stores/bedStore';
import { CanvasTool } from '../types/bed.types';

interface UseCanvasToolsProps {
  isInFocusMode: boolean;
  handleExitFocus: () => void;
  handleToolChange: (tool: CanvasTool) => void;
}

export const useCanvasTools = ({
  isInFocusMode,
  handleExitFocus,
  handleToolChange
}: UseCanvasToolsProps) => {
  const { tool } = useBedStore();

  // Exit focus mode when switching to creation tools
  useEffect(() => {
    if (isInFocusMode && (tool === 'create-rectangle' || tool === 'create-circle')) {
      handleExitFocus();
    }
  }, [tool, isInFocusMode, handleExitFocus]);

  // Only expose tool and an always store-updating setter
  return {
    tool,
    setTool: handleToolChange
  };
};
