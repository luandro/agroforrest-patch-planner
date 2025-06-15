
import { useBedSelection } from './useBedSelection';
import { useSelectionState } from './useSelectionState';

interface UseBedSelectionFlowProps {
  viewport: any;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
}

export const useBedSelectionFlow = ({ viewport, canvasRef, onEnterFocus, onExitFocus }: UseBedSelectionFlowProps) => {
  // Get selection state management with focus handlers
  const { handleSelectionChange, handleClearSelection } = useSelectionState({
    onEnterFocus,
    onExitFocus
  });

  // Get bed selection mechanics (without focus logic)
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelection({ 
    viewport, 
    canvasRef,
    onSelectionChange: handleSelectionChange,
    onClearSelection: handleClearSelection
  });

  return {
    startSelection,
    updateSelection,
    finishSelection,
    deleteSelected
  };
};
