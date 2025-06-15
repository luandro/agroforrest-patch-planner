
import { useBedSelection } from './useBedSelection';

interface UseBedSelectionFlowProps {
  viewport: any;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
}

export const useBedSelectionFlow = ({ viewport, canvasRef, onEnterFocus, onExitFocus }: UseBedSelectionFlowProps) => {
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelection({ 
    viewport, 
    canvasRef,
    onEnterFocus,
    onExitFocus
  });

  return {
    startSelection,
    updateSelection,
    finishSelection,
    deleteSelected
  };
};
