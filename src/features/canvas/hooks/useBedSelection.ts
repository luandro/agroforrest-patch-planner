
import { useCallback, useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { Bed, SelectionArea } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';

interface UseBedSelectionProps {
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useBedSelection = ({ viewport, canvasRef }: UseBedSelectionProps) => {
  const { 
    beds, 
    selectedBedIds, 
    selectBeds, 
    clearSelection, 
    toggleBedSelection,
    updateBed,
    removeBeds 
  } = useBedStore();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionArea, setSelectionArea] = useState<SelectionArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Convert screen coordinates to world coordinates using the same logic as rendering
  const screenToWorld = useCallback((screenX: number, screenY: number): { x: number; y: number } => {
    const canvas = canvasRef?.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Convert to display coordinates (accounting for device pixel ratio)
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    // Scale factor: pixels per meter in world space
    const pixelsPerMeter = 50 * viewport.zoom;
    
    // Convert screen coordinates relative to canvas to world coordinates
    const relativeX = screenX - rect.left;
    const relativeY = screenY - rect.top;
    
    // Convert to world coordinates with proper centering (same as rendering)
    const worldX = viewport.centerX + (relativeX - displayWidth / 2) / pixelsPerMeter;
    const worldY = viewport.centerY - (relativeY - displayHeight / 2) / pixelsPerMeter;
    
    return { x: worldX, y: worldY };
  }, [viewport, canvasRef]);

  // Check if a point is inside a bed
  const isPointInBed = useCallback((x: number, y: number, bed: Bed): boolean => {
    const dx = x - bed.position.x;
    const dy = y - bed.position.y;

    if (bed.shape === 'circle') {
      const radius = bed.dimensions.radius || 0;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    } else {
      const length = bed.dimensions.length || 0;
      const width = bed.dimensions.width || 0;
      return Math.abs(dx) <= length / 2 && Math.abs(dy) <= width / 2;
    }
  }, []);

  // Find bed at screen coordinates
  const getBedAtPoint = useCallback((screenX: number, screenY: number): Bed | null => {
    const worldPos = screenToWorld(screenX, screenY);
    
    // Check beds in reverse order (top to bottom in visual stack)
    for (let i = beds.length - 1; i >= 0; i--) {
      const bed = beds[i];
      if (isPointInBed(worldPos.x, worldPos.y, bed)) {
        return bed;
      }
    }
    
    return null;
  }, [beds, screenToWorld, isPointInBed]);

  // Start selection (single click or area selection)
  const startSelection = useCallback((screenX: number, screenY: number, isMultiSelect: boolean = false) => {
    const bed = getBedAtPoint(screenX, screenY);
    
    if (bed) {
      // Click on a bed
      if (isMultiSelect) {
        toggleBedSelection(bed.id);
      } else {
        if (selectedBedIds.includes(bed.id)) {
          // Already selected, start dragging
          setIsDragging(true);
          setDragStart(screenToWorld(screenX, screenY));
        } else {
          // Select this bed
          selectBeds([bed.id]);
        }
      }
    } else {
      // Click on empty space
      if (!isMultiSelect) {
        clearSelection();
      }
      
      // Start area selection
      setIsSelecting(true);
      const worldPos = screenToWorld(screenX, screenY);
      setSelectionArea({
        startX: worldPos.x,
        startY: worldPos.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    }
  }, [getBedAtPoint, selectedBedIds, toggleBedSelection, selectBeds, clearSelection, screenToWorld]);

  // Update selection area or drag selected beds
  const updateSelection = useCallback((screenX: number, screenY: number) => {
    const worldPos = screenToWorld(screenX, screenY);

    if (isSelecting && selectionArea) {
      // Update selection area
      setSelectionArea({
        ...selectionArea,
        endX: worldPos.x,
        endY: worldPos.y
      });
    } else if (isDragging && dragStart) {
      // Drag selected beds
      const deltaX = worldPos.x - dragStart.x;
      const deltaY = worldPos.y - dragStart.y;

      selectedBedIds.forEach(bedId => {
        const bed = beds.find(b => b.id === bedId);
        if (bed) {
          updateBed(bedId, {
            position: {
              x: bed.position.x + deltaX,
              y: bed.position.y + deltaY
            }
          });
        }
      });

      setDragStart(worldPos);
    }
  }, [isSelecting, selectionArea, isDragging, dragStart, screenToWorld, selectedBedIds, beds, updateBed]);

  // Finish selection
  const finishSelection = useCallback(() => {
    if (isSelecting && selectionArea) {
      // Select all beds in selection area
      const minX = Math.min(selectionArea.startX, selectionArea.endX);
      const maxX = Math.max(selectionArea.startX, selectionArea.endX);
      const minY = Math.min(selectionArea.startY, selectionArea.endY);
      const maxY = Math.max(selectionArea.startY, selectionArea.endY);

      const selectedIds = beds
        .filter(bed => 
          bed.position.x >= minX && bed.position.x <= maxX &&
          bed.position.y >= minY && bed.position.y <= maxY
        )
        .map(bed => bed.id);

      selectBeds(selectedIds);
    }

    // Reset state
    setIsSelecting(false);
    setSelectionArea(null);
    setIsDragging(false);
    setDragStart(null);
  }, [isSelecting, selectionArea, beds, selectBeds]);

  // Delete selected beds
  const deleteSelected = useCallback(() => {
    if (selectedBedIds.length > 0) {
      removeBeds(selectedBedIds);
    }
  }, [selectedBedIds, removeBeds]);

  return {
    selectedBedIds,
    selectionArea,
    isSelecting,
    isDragging,
    startSelection,
    updateSelection,
    finishSelection,
    deleteSelected,
    getBedAtPoint
  };
};
