
import type { CanvasViewport } from '../types/canvas.types';
import type { Bed, CanvasTool } from '../types/bed.types';
import { useCanvasEventHandlers } from './useCanvasEventHandlers';

interface UseCanvasEventOrchestratorProps {
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
  viewport?: CanvasViewport;
  focusedBed?: Bed | null;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useCanvasEventOrchestrator = (props: UseCanvasEventOrchestratorProps) => {
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  } = useCanvasEventHandlers(props);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  };
};
