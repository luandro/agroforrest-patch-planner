
import { useCallback, useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { Bed, BedConfig } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';

interface UseBedCreationProps {
  viewport: CanvasViewport;
  gridSize?: number;
  onBedCreated?: (bedId: string) => void;
}

export const useBedCreation = ({ viewport, gridSize = 1, onBedCreated }: UseBedCreationProps) => {
  const { addBed, tool } = useBedStore();
  const [isCreating, setIsCreating] = useState(false);
  const [previewBed, setPreviewBed] = useState<Bed | null>(null);
  const [placementBed, setPlacementBed] = useState<Bed | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [multiCreationMode, setMultiCreationMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

  // Default bed configuration
  const [bedConfig, setBedConfig] = useState<BedConfig>({
    shape: 'rectangle',
    length: 5,
    width: 1,
    spacing: 0.4,
    quantity: 1
  });

  const updateBedConfig = useCallback((updates: Partial<BedConfig>) => {
    setBedConfig(prev => ({ ...prev, ...updates }));
    
    // Update preview bed with new config if we're in preview mode
    if (previewBed && cursorPosition) {
      const worldPos = screenToWorld(cursorPosition.x, cursorPosition.y);
      const snappedPos = snapToGrid(worldPos.x, worldPos.y);
      
      const updatedPreview: Bed = {
        ...previewBed,
        shape: updates.shape || previewBed.shape,
        dimensions: updates.shape === 'rectangle' 
          ? { length: updates.length || bedConfig.length, width: updates.width || bedConfig.width }
          : { radius: updates.length || bedConfig.length },
        position: snappedPos
      };
      
      setPreviewBed(updatedPreview);
    }
  }, [previewBed, cursorPosition, bedConfig]);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX: number, screenY: number): { x: number; y: number } => {
    const pixelsPerMeter = 50 * viewport.zoom;
    const centerOffsetX = screenX - (viewport.width * pixelsPerMeter) / 2;
    const centerOffsetY = screenY - (viewport.height * pixelsPerMeter) / 2;
    
    return {
      x: viewport.centerX + centerOffsetX / pixelsPerMeter,
      y: viewport.centerY - centerOffsetY / pixelsPerMeter
    };
  }, [viewport]);

  // Snap to grid if enabled
  const snapToGrid = useCallback((x: number, y: number): { x: number; y: number } => {
    if (!gridSize) return { x, y };
    
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [gridSize]);

  // Check if position has collision with existing beds
  const checkCollision = useCallback((position: { x: number; y: number }, dimensions: any): boolean => {
    // This would check against existing beds in a real implementation
    // For now, just return false
    return false;
  }, []);

  const startPreview = useCallback((screenX: number, screenY: number) => {
    if (tool !== 'create-rectangle' && tool !== 'create-circle') return;

    const worldPos = screenToWorld(screenX, screenY);
    const snappedPos = snapToGrid(worldPos.x, worldPos.y);
    
    setCursorPosition({ x: screenX, y: screenY });
    setIsCreating(true);

    // Create preview bed
    const previewBedData: Bed = {
      id: `preview-${Date.now()}`,
      shape: bedConfig.shape,
      position: snappedPos,
      dimensions: bedConfig.shape === 'rectangle' 
        ? { length: bedConfig.length, width: bedConfig.width }
        : { radius: bedConfig.length },
      rotation: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setPreviewBed(previewBedData);
  }, [tool, bedConfig, screenToWorld, snapToGrid]);

  const updatePreview = useCallback((screenX: number, screenY: number) => {
    if (!isCreating || !previewBed) return;

    const worldPos = screenToWorld(screenX, screenY);
    const snappedPos = snapToGrid(worldPos.x, worldPos.y);
    
    setCursorPosition({ x: screenX, y: screenY });

    setPreviewBed({
      ...previewBed,
      position: snappedPos
    });
  }, [isCreating, previewBed, screenToWorld, snapToGrid]);

  const placeBed = useCallback(() => {
    if (!previewBed) return;

    // Move from preview to placement
    setPlacementBed(previewBed);
    setPreviewBed(null);
    setShowConfirmation(true);
    setIsCreating(false);
  }, [previewBed]);

  const confirmPlacement = useCallback(() => {
    if (!placementBed) return;

    // Create final bed(s) based on configuration
    const beds: Bed[] = [];
    
    for (let i = 0; i < bedConfig.quantity; i++) {
      const offsetY = i * (bedConfig.spacing + (placementBed.dimensions.width || bedConfig.width));
      
      const bedId = `bed-${Date.now()}-${i}`;
      const bed: Bed = {
        id: bedId,
        shape: placementBed.shape,
        position: {
          x: placementBed.position.x,
          y: placementBed.position.y + offsetY
        },
        dimensions: placementBed.dimensions,
        rotation: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      beds.push(bed);
      addBed(bed);
      
      // Call auto-zoom callback for the first bed
      if (i === 0 && onBedCreated) {
        onBedCreated(bedId);
      }
    }

    // Reset state
    setPlacementBed(null);
    setShowConfirmation(false);
    setCursorPosition(null);

    // If not in multi-creation mode, exit creation
    if (!multiCreationMode) {
      // This will be handled by the canvas component
    }
  }, [placementBed, bedConfig, addBed, onBedCreated, multiCreationMode]);

  const cancelPlacement = useCallback(() => {
    if (placementBed && cursorPosition) {
      // Resume preview at cursor position
      setPreviewBed(placementBed);
      setPlacementBed(null);
      setShowConfirmation(false);
      setIsCreating(true);
    } else {
      // Cancel completely
      setPlacementBed(null);
      setPreviewBed(null);
      setShowConfirmation(false);
      setIsCreating(false);
      setCursorPosition(null);
    }
  }, [placementBed, cursorPosition]);

  const cancelCreation = useCallback(() => {
    setIsCreating(false);
    setPreviewBed(null);
    setPlacementBed(null);
    setShowConfirmation(false);
    setCursorPosition(null);
    setMultiCreationMode(false);
  }, []);

  return {
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    placementBed,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    startPreview,
    updatePreview,
    placeBed,
    confirmPlacement,
    cancelPlacement,
    cancelCreation,
    checkCollision
  };
};
