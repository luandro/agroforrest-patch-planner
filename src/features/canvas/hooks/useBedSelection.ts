
import { useCallback, useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { Bed, SelectionArea } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';

interface UseBedSelectionProps {
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
}

export const useBedSelection = ({ viewport, canvasRef, onEnterFocus, onExitFocus }: UseBedSelectionProps) => {
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

  // Handle focus mode when selection changes
  const handleSelectionChange = useCallback((newSelectedIds: string[]) => {
    selectBeds(newSelectedIds);
    
    // Trigger focus mode for single selection, exit for multiple or no selection
    if (newSelectedIds.length === 1) {
      onEnterFocus?.(newSelectedIds[0]);
    } else if (newSelectedIds.length !== 1) {
      onExitFocus?.();
    }
  }, [selectBeds, onEnterFocus, onExitFocus]);

  // Handle focus mode when clearing selection
  const handleClearSelection = useCallback(() => {
    clearSelection();
    onExitFocus?.();
  }, [clearSelection, onExitFocus]);

  // Convert canvas-relative coordinates to world coordinates
  const canvasToWorld = useCallback((canvasX: number, canvasY: number): { x: number; y: number } => {
    const canvas = canvasRef?.current;
    if (!canvas) return { x: 0, y: 0 };

    // Get canvas display dimensions
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Scale factor: pixels per meter in world space
    const pixelsPerMeter = 50 * viewport.zoom;
    
    // Convert canvas-relative coordinates to world coordinates with proper centering
    const worldX = viewport.centerX + (canvasX - displayWidth / 2) / pixelsPerMeter;
    const worldY = viewport.centerY - (canvasY - displayHeight / 2) / pixelsPerMeter;
    
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

  // Find bed at canvas coordinates
  const getBedAtPoint = useCallback((canvasX: number, canvasY: number): Bed | null => {
    const worldPos = canvasToWorld(canvasX, canvasY);
    
    // Check beds in reverse order (top to bottom in visual stack)
    for (let i = beds.length - 1; i >= 0; i--) {
      const bed = beds[i];
      if (isPointInBed(worldPos.x, worldPos.y, bed)) {
        return bed;
      }
    }
    
    return null;
  }, [beds, canvasToWorld, isPointInBed]);

  // Start selection (single click or area selection) - now takes canvas-relative coordinates
  const startSelection = useCallback((canvasX: number, canvasY: number, isMultiSelect: boolean = false) => {
    const bed = getBedAtPoint(canvasX, canvasY);
    
    if (bed) {
      // Click on a bed
      if (isMultiSelect) {
        toggleBedSelection(bed.id);
        // Handle focus mode based on resulting selection
        const newSelection = selectedBedIds.includes(bed.id) 
          ? selectedBedIds.filter(id => id !== bed.id)
          : [...selectedBedIds, bed.id];
        
        if (newSelection.length === 1) {
          onEnterFocus?.(newSelection[0]);
        } else {
          onExitFocus?.();
        }
      } else {
        if (selectedBedIds.includes(bed.id)) {
          // Already selected, start dragging
          setIsDragging(true);
          setDragStart(canvasToWorld(canvasX, canvasY));
        } else {
          // Select this bed and enter focus mode
          handleSelectionChange([bed.id]);
        }
      }
    } else {
      // Click on empty space
      if (!isMultiSelect) {
        handleClearSelection();
      }
      
      // Start area selection
      setIsSelecting(true);
      const worldPos = canvasToWorld(canvasX, canvasY);
      setSelectionArea({
        startX: worldPos.x,
        startY: worldPos.y,
        endX: worldPos.x,
        endY: worldPos.y
      });
    }
  }, [getBedAtPoint, selectedBedIds, toggleBedSelection, handleSelectionChange, handleClearSelection, canvasToWorld, onEnterFocus, onExitFocus]);

  // Update selection area or drag selected beds - now takes canvas-relative coordinates
  const updateSelection = useCallback((canvasX: number, canvasY: number) => {
    const worldPos = canvasToWorld(canvasX, canvasY);

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
  }, [isSelecting, selectionArea, isDragging, dragStart, canvasToWorld, selectedBedIds, beds, updateBed]);

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

      handleSelectionChange(selectedIds);
    }

    // Reset state
    setIsSelecting(false);
    setSelectionArea(null);
    setIsDragging(false);
    setDragStart(null);
  }, [isSelecting, selectionArea, beds, handleSelectionChange]);

  // Delete selected beds
  const deleteSelected = useCallback(() => {
    if (selectedBedIds.length > 0) {
      removeBeds(selectedBedIds);
      onExitFocus?.(); // Exit focus mode when deleting
    }
  }, [selectedBedIds, removeBeds, onExitFocus]);

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
