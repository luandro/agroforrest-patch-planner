
import { useBedSelection } from './useBedSelection';

interface UseBedSelectionFlowProps {
  viewport: any;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useBedSelectionFlow = ({ viewport, canvasRef }: UseBedSelectionFlowProps) => {
  // Bed selection management - Updated to remove automatic focus mode
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelection({ 
    viewport, 
    canvasRef,
    // Remove automatic focus mode triggers
    onEnterFocus: undefined,
    onExitFocus: undefined
  });

  return {
    startSelection,
    updateSelection,
    finishSelection,
    deleteSelected
  };
};
