
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasState } from './useCanvasState';
import { useCanvasStateManager } from './useCanvasStateManager';
import { useCanvasLayoutOrchestrator } from './useCanvasLayoutOrchestrator';

export const usePatchCanvasOrchestrator = ({
  initialViewport,
  onViewportChange,
  onOpenPlantSelection,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5,
}: PatchCanvasProps) => {
  const { canvasRef, isCollapsed, onToggleCollapse } = useCanvasState();

  // Unified state management
  const stateManager = useCanvasStateManager({
    initialViewport,
    onViewportChange,
    onOpenPlantSelection,
    gridSize,
    minZoom,
    maxZoom,
    canvasRef
  });

  // Layout orchestration
  const { layoutProps } = useCanvasLayoutOrchestrator({
    ...stateManager,
    gridSize,
    minZoom,
    maxZoom,
    canvasRef
  });

  return {
    canvasRef,
    isCollapsed,
    onToggleCollapse,
    layoutProps,
  };
};
