
import { useCallback, useState } from 'react';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { Bed } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';

interface UsePlantSelectionProps {
  focusedBed: Bed | null;
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const usePlantSelection = ({
  focusedBed,
  viewport,
  canvasRef
}: UsePlantSelectionProps) => {
  const {
    selectedPlacementIds,
    selectPlacements,
    clearSelection,
    getPlacementsForBed
  } = usePlantPlacementStore();

  const [isAreaSelecting, setIsAreaSelecting] = useState(false);
  const [selectionArea, setSelectionArea] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  // Convert canvas coordinates to bed-relative coordinates
  const canvasToBedCoordinates = useCallback((canvasX: number, canvasY: number) => {
    if (!focusedBed || !canvasRef?.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const pixelsPerMeter = 50 * viewport.zoom;
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    const bedScreenX = (displayWidth / 2) + (focusedBed.position.x - viewport.centerX) * pixelsPerMeter;
    const bedScreenY = (displayHeight / 2) - (focusedBed.position.y - viewport.centerY) * pixelsPerMeter;
    
    const relativeX = (canvasX - bedScreenX) / pixelsPerMeter;
    const relativeY = -(canvasY - bedScreenY) / pixelsPerMeter;
    
    return { x: relativeX, y: relativeY };
  }, [focusedBed, viewport, canvasRef]);

  // Find plant at canvas position with improved tolerance
  const getPlantAtCanvasPosition = useCallback((canvasX: number, canvasY: number) => {
    if (!focusedBed) return null;

    const bedPos = canvasToBedCoordinates(canvasX, canvasY);
    if (!bedPos) return null;

    const placements = getPlacementsForBed(focusedBed.id);
    const tolerance = 0.2; // Increased tolerance for better touch interaction

    return placements.find(placement =>
      Math.abs(placement.position.x - bedPos.x) < tolerance &&
      Math.abs(placement.position.y - bedPos.y) < tolerance
    ) || null;
  }, [focusedBed, canvasToBedCoordinates, getPlacementsForBed]);

  // Enhanced plant selection with better multi-select support
  const handlePlantSelection = useCallback((canvasX: number, canvasY: number, isMultiSelect: boolean = false) => {
    const plant = getPlantAtCanvasPosition(canvasX, canvasY);
    
    if (plant) {
      if (isMultiSelect) {
        // Multi-select toggle with improved logic
        const newSelection = selectedPlacementIds.includes(plant.id)
          ? selectedPlacementIds.filter(id => id !== plant.id)
          : [...selectedPlacementIds, plant.id];
        selectPlacements(newSelection);
      } else {
        // Single select with toggle behavior
        if (selectedPlacementIds.length === 1 && selectedPlacementIds[0] === plant.id) {
          // Deselect if clicking the only selected plant
          clearSelection();
        } else {
          selectPlacements([plant.id]);
        }
      }
      return true; // Plant was selected
    } else {
      // Clicked empty space
      if (!isMultiSelect) {
        clearSelection();
      }
      return false; // No plant selected
    }
  }, [getPlantAtCanvasPosition, selectedPlacementIds, selectPlacements, clearSelection]);

  // Start area selection with visual feedback
  const startAreaSelection = useCallback((canvasX: number, canvasY: number) => {
    setIsAreaSelecting(true);
    setSelectionArea({
      startX: canvasX,
      startY: canvasY,
      endX: canvasX,
      endY: canvasY
    });
  }, []);

  // Update area selection
  const updateAreaSelection = useCallback((canvasX: number, canvasY: number) => {
    if (isAreaSelecting && selectionArea) {
      setSelectionArea({
        ...selectionArea,
        endX: canvasX,
        endY: canvasY
      });
    }
  }, [isAreaSelecting, selectionArea]);

  // Finish area selection with improved selection logic
  const finishAreaSelection = useCallback(() => {
    if (!isAreaSelecting || !selectionArea || !focusedBed) {
      setIsAreaSelecting(false);
      setSelectionArea(null);
      return;
    }

    const placements = getPlacementsForBed(focusedBed.id);
    const selectedIds: string[] = [];

    // Convert selection area to bed coordinates
    const startBedPos = canvasToBedCoordinates(selectionArea.startX, selectionArea.startY);
    const endBedPos = canvasToBedCoordinates(selectionArea.endX, selectionArea.endY);

    if (startBedPos && endBedPos) {
      const minX = Math.min(startBedPos.x, endBedPos.x);
      const maxX = Math.max(startBedPos.x, endBedPos.x);
      const minY = Math.min(startBedPos.y, endBedPos.y);
      const maxY = Math.max(startBedPos.y, endBedPos.y);

      placements.forEach(placement => {
        if (placement.position.x >= minX && placement.position.x <= maxX &&
            placement.position.y >= minY && placement.position.y <= maxY) {
          selectedIds.push(placement.id);
        }
      });
    }

    selectPlacements(selectedIds);
    setIsAreaSelecting(false);
    setSelectionArea(null);
  }, [isAreaSelecting, selectionArea, focusedBed, getPlacementsForBed, canvasToBedCoordinates, selectPlacements]);

  // Select all plants of same species with visual feedback
  const selectSameSpecies = useCallback(() => {
    if (!focusedBed || selectedPlacementIds.length === 0) return;

    const placements = getPlacementsForBed(focusedBed.id);
    const selectedPlacement = placements.find(p => p.id === selectedPlacementIds[0]);
    
    if (selectedPlacement) {
      const sameSpeciesIds = placements
        .filter(p => p.species.id === selectedPlacement.species.id)
        .map(p => p.id);
      selectPlacements(sameSpeciesIds);
    }
  }, [focusedBed, selectedPlacementIds, getPlacementsForBed, selectPlacements]);

  // Select all plants in bed
  const selectAll = useCallback(() => {
    if (!focusedBed) return;
    
    const placements = getPlacementsForBed(focusedBed.id);
    const allIds = placements.map(p => p.id);
    selectPlacements(allIds);
  }, [focusedBed, getPlacementsForBed, selectPlacements]);

  // Invert current selection
  const invertSelection = useCallback(() => {
    if (!focusedBed) return;
    
    const placements = getPlacementsForBed(focusedBed.id);
    const allIds = placements.map(p => p.id);
    const invertedIds = allIds.filter(id => !selectedPlacementIds.includes(id));
    selectPlacements(invertedIds);
  }, [focusedBed, getPlacementsForBed, selectedPlacementIds, selectPlacements]);

  return {
    selectedPlacementIds,
    isAreaSelecting,
    selectionArea,
    handlePlantSelection,
    startAreaSelection,
    updateAreaSelection,
    finishAreaSelection,
    selectSameSpecies,
    selectAll,
    invertSelection,
    clearSelection,
    getPlantAtCanvasPosition
  };
};
