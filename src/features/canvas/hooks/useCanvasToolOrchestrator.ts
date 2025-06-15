
import { useCallback } from 'react';
import { CanvasTool } from '../types/bed.types';
import { useCanvasTools } from './useCanvasTools';

interface UseCanvasToolOrchestratorProps {
  isInFocusMode: boolean;
  handleExitFocus: () => void;
  clearPreview: () => void;
  clearPlacement: () => void;
  setTool: (tool: CanvasTool) => void;
}

export const useCanvasToolOrchestrator = ({
  isInFocusMode,
  handleExitFocus,
  clearPreview,
  clearPlacement,
  setTool
}: UseCanvasToolOrchestratorProps) => {
  // Tool management with existing logic
  const { tool } = useCanvasTools({
    isInFocusMode,
    handleExitFocus,
    handleToolChange: setTool
  });

  // Enhanced tool change handler that clears states
  const handleToolChange = useCallback((newTool: CanvasTool) => {
    if (newTool !== tool) {
      clearPreview();
      clearPlacement();
    }
    setTool(newTool);
  }, [tool, clearPreview, clearPlacement, setTool]);

  return {
    tool,
    handleToolChange
  };
};
