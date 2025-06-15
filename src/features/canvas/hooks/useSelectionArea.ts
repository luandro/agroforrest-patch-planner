
import { useCallback, useState } from 'react';
import { SelectionArea } from '../types/bed.types';

export const useSelectionArea = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionArea, setSelectionArea] = useState<SelectionArea | null>(null);

  const startAreaSelection = useCallback((worldX: number, worldY: number) => {
    setIsSelecting(true);
    setSelectionArea({
      startX: worldX,
      startY: worldY,
      endX: worldX,
      endY: worldY
    });
  }, []);

  const updateAreaSelection = useCallback((worldX: number, worldY: number) => {
    if (isSelecting && selectionArea) {
      setSelectionArea({
        ...selectionArea,
        endX: worldX,
        endY: worldY
      });
    }
  }, [isSelecting, selectionArea]);

  const finishAreaSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectionArea(null);
  }, []);

  const getSelectionBounds = useCallback(() => {
    if (!selectionArea) return null;

    return {
      minX: Math.min(selectionArea.startX, selectionArea.endX),
      maxX: Math.max(selectionArea.startX, selectionArea.endX),
      minY: Math.min(selectionArea.startY, selectionArea.endY),
      maxY: Math.max(selectionArea.startY, selectionArea.endY)
    };
  }, [selectionArea]);

  return {
    isSelecting,
    selectionArea,
    startAreaSelection,
    updateAreaSelection,
    finishAreaSelection,
    getSelectionBounds
  };
};
