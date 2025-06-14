
import { useCallback, useState } from 'react';
import { useBedStore } from '../stores/bedStore';
import { Bed, BedConfig } from '../types/bed.types';
import { CanvasViewport } from '../types/canvas.types';

interface UseBedCreationProps {
  viewport: CanvasViewport;
  gridSize?: number;
}

export const useBedCreation = ({ viewport, gridSize = 1 }: UseBedCreationProps) => {
  const { addBed, tool } = useBedStore();
  const [isCreating, setIsCreating] = useState(false);
  const [previewBed, setPreviewBed] = useState<Bed | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

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
  }, []);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX: number, screenY: number): { x: number; y: number } => {
    const pixelsPerMeter = 50 * viewport.zoom;
    const centerOffsetX = screenX - (viewport.width * pixelsPerMeter) / 2;
    const centerOffsetY = screenY - (viewport.height * pixelsPerMeter) / 2;
    
    return {
      x: viewport.centerX + centerOffsetX / pixelsPerMeter,
      y: viewport.centerY - centerOffsetY / pixelsPerMeter // Flip Y for natural feel
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

  const startCreation = useCallback((screenX: number, screenY: number) => {
    if (tool !== 'create-rectangle' && tool !== 'create-circle') return;

    const worldPos = screenToWorld(screenX, screenY);
    const snappedPos = snapToGrid(worldPos.x, worldPos.y);
    
    setStartPoint(snappedPos);
    setIsCreating(true);

    // Create initial preview bed
    const initialBed: Bed = {
      id: `preview-${Date.now()}`,
      shape: bedConfig.shape,
      position: snappedPos,
      dimensions: bedConfig.shape === 'rectangle' 
        ? { length: 0.1, width: 0.1 }
        : { radius: 0.1 },
      rotation: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setPreviewBed(initialBed);
  }, [tool, bedConfig.shape, screenToWorld, snapToGrid]);

  const updateCreation = useCallback((screenX: number, screenY: number) => {
    if (!isCreating || !startPoint || !previewBed) return;

    const worldPos = screenToWorld(screenX, screenY);
    const snappedPos = snapToGrid(worldPos.x, worldPos.y);

    if (bedConfig.shape === 'rectangle') {
      const length = Math.abs(snappedPos.x - startPoint.x);
      const width = Math.abs(snappedPos.y - startPoint.y);
      const centerX = (startPoint.x + snappedPos.x) / 2;
      const centerY = (startPoint.y + snappedPos.y) / 2;

      setPreviewBed({
        ...previewBed,
        position: { x: centerX, y: centerY },
        dimensions: { length: Math.max(0.1, length), width: Math.max(0.1, width) }
      });
    } else {
      const radius = Math.sqrt(
        Math.pow(snappedPos.x - startPoint.x, 2) + 
        Math.pow(snappedPos.y - startPoint.y, 2)
      );

      setPreviewBed({
        ...previewBed,
        dimensions: { radius: Math.max(0.1, radius) }
      });
    }
  }, [isCreating, startPoint, previewBed, bedConfig.shape, screenToWorld, snapToGrid]);

  const finishCreation = useCallback(() => {
    if (!isCreating || !previewBed) return;

    // Create final bed(s) based on configuration
    const beds: Bed[] = [];
    
    for (let i = 0; i < bedConfig.quantity; i++) {
      const offsetY = i * (bedConfig.spacing + (previewBed.dimensions.width || 0));
      
      const bed: Bed = {
        id: `bed-${Date.now()}-${i}`,
        shape: previewBed.shape,
        position: {
          x: previewBed.position.x,
          y: previewBed.position.y + offsetY
        },
        dimensions: previewBed.dimensions,
        rotation: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      beds.push(bed);
      addBed(bed);
    }

    // Reset creation state
    setIsCreating(false);
    setPreviewBed(null);
    setStartPoint(null);
  }, [isCreating, previewBed, bedConfig, addBed]);

  const cancelCreation = useCallback(() => {
    setIsCreating(false);
    setPreviewBed(null);
    setStartPoint(null);
  }, []);

  return {
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    startCreation,
    updateCreation,
    finishCreation,
    cancelCreation
  };
};
