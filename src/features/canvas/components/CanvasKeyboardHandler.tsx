
import { useEffect } from 'react';
import { useBedStore } from '../stores/bedStore';
import { CanvasTool } from '../types/bed.types';

interface CanvasKeyboardHandlerProps {
  pan: (deltaX: number, deltaY: number) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitAll: () => void;
  isCreating: boolean;
  cancelCreation: () => void;
  setIsCreatingBed: (creating: boolean) => void;
  setTool: (tool: CanvasTool) => void;
  selectedBedIds: string[];
  deleteSelected: () => void;
}

export const CanvasKeyboardHandler: React.FC<CanvasKeyboardHandlerProps> = ({
  pan,
  handleZoomIn,
  handleZoomOut,
  handleFitAll,
  isCreating,
  cancelCreation,
  setIsCreatingBed,
  setTool,
  selectedBedIds,
  deleteSelected
}) => {
  const { undo, redo } = useBedStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our handled keys
      const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '=', '-', '0', 'Delete', 'Backspace'];
      if (handledKeys.includes(e.key) || (e.ctrlKey && (e.key === 'z' || e.key === 'Z'))) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          pan(0, -50);
          break;
        case 'ArrowDown':
          pan(0, 50);
          break;
        case 'ArrowLeft':
          pan(-50, 0);
          break;
        case 'ArrowRight':
          pan(50, 0);
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleFitAll();
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedBedIds.length > 0) {
            deleteSelected();
          }
          break;
        case 'z':
        case 'Z':
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;
        case 'Escape':
          if (isCreating) {
            cancelCreation();
            setIsCreatingBed(false);
          }
          setTool('pan' as CanvasTool);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pan, isCreating, selectedBedIds, handleZoomIn, handleZoomOut, handleFitAll, cancelCreation, setIsCreatingBed, setTool, deleteSelected, undo, redo]);

  return null;
};
