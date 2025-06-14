
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

  // Convert screen coordinates to world coordinates with proper canvas transformation
  const screenToWorld = useCallback((screenX: number, screenY: number): { x: number; y: number } => {
    // Get canvas element and its bounding rect for accurate positioning
    const canvas = document.querySelector('canvas');
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Calculate relative position within canvas
    const canvasX = (screenX - rect.left) * devicePixelRatio;
    const canvasY = (screenY - rect.top) * devicePixelRatio;
    
    // Convert canvas pixels to display pixels
    const displayX = canvasX / devicePixelRatio;
    const displayY = canvasY / devicePixelRatio;
    
    // Canvas dimensions
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // Scale factor: pixels per meter in world space
    const pixelsPerMeter = 50 * viewport.zoom;
    
    // Convert to world coordinates with proper centering
    const worldX = viewport.centerX + (displayX - canvasWidth / 2) / pixelsPerMeter;
    const worldY = viewport.centerY - (displayY - canvasHeight / 2) / pixelsPerMeter;
    
    return { x: worldX, y: worldY };
  }, [viewport]);

  // Snap coordinates to grid intersections with proper alignment
  const snapToGrid = useCallback((x: number, y: number): { x: number; y: number } => {
    if (!gridSize || gridSize <= 0) return { x, y };
    
    // Snap to grid intersections (not cell centers)
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    
    return { 
      x: Math.round(snappedX * 10) / 10, // Round to 0.1m precision
      y: Math.round(snappedY * 10) / 10
    };
  }, [gridSize]);

  // Calculate bed position based on shape and snapping rules
  const calculateBedPosition = useCallback((worldPos: { x: number; y: number }, shape: 'rectangle' | 'circle') => {
    const snappedPos = snapToGrid(worldPos.x, worldPos.y);
    
    if (shape === 'rectangle') {
      // For rectangles, snap the center point and ensure edges align with grid
      const length = bedConfig.length;
      const width = bedConfig.width;
      
      // Adjust position so bed edges align with grid lines
      const adjustedX = Math.round(snappedPos.x / gridSize) * gridSize;
      const adjustedY = Math.round(snappedPos.y / gridSize) * gridSize;
      
      return { x: adjustedX, y: adjustedY };
    } else {
      // For circles, always snap center to grid intersection
      return snappedPos;
    }
  }, [snapToGrid, bedConfig, gridSize]);

  // Check if position has collision with existing beds
  const checkCollision = useCallback((position: { x: number; y: number }, dimensions: any): boolean => {
    // This would check against existing beds in a real implementation
    // For now, just return false
    return false;
  }, []);

  const startPreview = useCallback((screenX: number, screenY: number) => {
    if (tool !== 'create-rectangle' && tool !== 'create-circle') return;

    const worldPos = screenToWorld(screenX, screenY);
    const bedPosition = calculateBedPosition(worldPos, bedConfig.shape);
    
    setCursorPosition({ x: screenX, y: screenY });
    setIsCreating(true);

    // Create preview bed with proper positioning
    const previewBedData: Bed = {
      id: `preview-${Date.now()}`,
      shape: bedConfig.shape,
      position: bedPosition,
      dimensions: bedConfig.shape === 'rectangle' 
        ? { length: bedConfig.length, width: bedConfig.width }
        : { radius: bedConfig.length },
      rotation: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setPreviewBed(previewBedData);
  }, [tool, bedConfig, screenToWorld, calculateBedPosition]);

  const updatePreview = useCallback((screenX: number, screenY: number) => {
    if (!isCreating || !previewBed) return;

    const worldPos = screenToWorld(screenX, screenY);
    const bedPosition = calculateBedPosition(worldPos, previewBed.shape);
    
    setCursorPosition({ x: screenX, y: screenY });

    setPreviewBed({
      ...previewBed,
      position: bedPosition
    });
  }, [isCreating, previewBed, screenToWorld, calculateBedPosition]);

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
