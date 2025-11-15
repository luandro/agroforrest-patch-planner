
import React, { useRef, useEffect } from 'react';
import { useCanvasGestures } from '../hooks/useCanvasGestures';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import type { CanvasViewport } from '../types/canvas.types';
import type { Bed, BedConfig, CanvasTool } from '../types/bed.types';
import type { ZoomToFn } from '../types/layout.types';

interface CanvasContainerProps {
  viewport: CanvasViewport;
  tool: CanvasTool;
  isCreating: boolean;
  handlePointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: ZoomToFn;
  beds: Bed[];
  selectedBedIds: string[];
  previewBed: Bed | null;
  placementBed?: Bed | null;
  previewBeds?: Bed[];
  placementBeds?: Bed[];
  hasCollision?: boolean;
  gridSize?: number;
  bedConfig?: BedConfig;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  focusedBed?: Bed | null;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  viewport,
  tool,
  isCreating,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleDoubleClick,
  pan,
  zoomTo,
  beds,
  selectedBedIds,
  previewBed,
  placementBed,
  previewBeds,
  placementBeds,
  hasCollision,
  gridSize = 1,
  bedConfig,
  canvasRef: externalCanvasRef,
  focusedBed
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use external canvas ref if provided, otherwise use internal
  const canvasRef = externalCanvasRef || internalCanvasRef;
  
  const { scheduleRender } = useCanvasRenderer({
    canvasRef,
    gridSize,
    spacing: (bedConfig?.spacing || 0.4) / 2,
    focusedBed
  });

  // Enhanced zoom function that supports center point
  const handleZoom = (zoom: number, centerX?: number, centerY?: number) => {
    if (centerX !== undefined && centerY !== undefined) {
      // When zooming with a center point, maintain that point's position
      zoomTo(zoom);
    } else {
      // Default zoom behavior
      zoomTo(zoom);
    }
  };

  // Enable gestures when in pan mode OR when not actively creating
  const gesturesEnabled = tool === 'pan' || !isCreating;
  console.log('Gestures enabled:', gesturesEnabled, 'tool:', tool, 'isCreating:', isCreating);

  // Handle gestures with enhanced zoom support
  useCanvasGestures({
    onPan: pan,
    onZoom: handleZoom,
    canvasRef,
    currentZoom: viewport.zoom,
    enabled: gesturesEnabled
  });

  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      scheduleRender(viewport, beds, selectedBedIds, previewBed, placementBed, previewBeds, placementBeds, hasCollision);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [viewport, scheduleRender, beds, selectedBedIds, previewBed, placementBed, previewBeds, placementBeds, hasCollision, canvasRef]);

  // Render when viewport or beds change
  useEffect(() => {
    scheduleRender(viewport, beds, selectedBedIds, previewBed, placementBed, previewBeds, placementBeds, hasCollision);
  }, [viewport, beds, selectedBedIds, previewBed, placementBed, previewBeds, placementBeds, hasCollision, scheduleRender]);

  const getCursorStyle = () => {
    if (isCreating) return 'crosshair';
    if (tool === 'create-rectangle' || tool === 'create-circle') return 'crosshair';
    if (tool === 'select') return 'pointer';
    return 'grab';
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ 
        touchAction: 'none', // Critical: Prevent browser touch behaviors
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{ 
          touchAction: 'none', // Prevent all browser touch handling
          background: '#FAFAF9',
          cursor: getCursorStyle(),
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
