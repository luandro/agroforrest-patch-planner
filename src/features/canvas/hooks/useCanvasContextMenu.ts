
import { useState, useCallback } from 'react';
import type { Bed } from '../types/bed.types';
import type { PlantPlacement } from '../stores/plantPlacementStore';

interface ContextMenuState {
  isOpen: boolean;
  placementId: string | null;
  x: number;
  y: number;
}

export const useCanvasContextMenu = () => {
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
    isOpen: false,
    placementId: null,
    x: 0,
    y: 0
  });

  const openContextMenu = useCallback((placementId: string, x: number, y: number) => {
    setContextMenuState({
      isOpen: true,
      placementId,
      x,
      y
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenuState({
      isOpen: false,
      placementId: null,
      x: 0,
      y: 0
    });
  }, []);

  const handleContextMenu = useCallback((
    e: React.MouseEvent,
    focusedBed: Bed | null,
    isPlacing: boolean,
    getPlantAtCanvasPosition: (x: number, y: number) => PlantPlacement | null
  ) => {
    e.preventDefault();
    
    if (!focusedBed || isPlacing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const plant = getPlantAtCanvasPosition(x, y);
    if (plant) {
      openContextMenu(plant.id, e.clientX, e.clientY);
    }
  }, [openContextMenu]);

  return {
    contextMenuState,
    openContextMenu,
    closeContextMenu,
    handleContextMenu
  };
};
