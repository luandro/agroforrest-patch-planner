
import { useState, useCallback } from 'react';

export const useCanvasHoverState = () => {
  const [hoveredPlacementId, setHoveredPlacementId] = useState<string | null>(null);

  const updateHoveredPlacement = useCallback((plantId: string | null) => {
    setHoveredPlacementId(plantId);
  }, []);

  const clearHoveredPlacement = useCallback(() => {
    setHoveredPlacementId(null);
  }, []);

  return {
    hoveredPlacementId,
    updateHoveredPlacement,
    clearHoveredPlacement
  };
};
