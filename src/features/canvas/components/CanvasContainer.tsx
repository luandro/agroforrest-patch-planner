
import React, { useRef, useEffect } from 'react';
import { useCanvasGestures } from '../hooks/useCanvasGestures';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';

interface CanvasContainerProps {
  viewport: any;
  tool: string;
  isCreating: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
  beds: any[];
  selectedBedIds: string[];
  previewBed?: any;
  previewBeds?: any[];
  placementBed?: any;
  placementBeds?: any[];
  gridSize?: number;
  spacing?: number;
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
  previewBeds,
  placementBed,
  placementBeds,
  gridSize = 1,
  spacing = 0.4
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scheduleRender, scheduleRenderLegacy, canvasRef } = useCanvasRenderer({
    gridSize,
    spacing
  });

  // Handle gestures with tool and creation state awareness
  useCanvasGestures({
    onPan: pan,
    onZoom: (zoom) => zoomTo(zoom),
    canvasRef,
    currentZoom: viewport.zoom,
    tool,
    isCreating
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

      // Use new array-based rendering if available, otherwise fall back to legacy
      if (previewBeds || placementBeds) {
        const actualPreviewBeds = previewBeds || (previewBed ? [previewBed] : []);
        const actualPlacementBeds = placementBeds || (placementBed ? [placementBed] : []);
        scheduleRender(viewport, beds, selectedBedIds, actualPreviewBeds, actualPlacementBeds);
      } else {
        scheduleRenderLegacy(viewport, beds, selectedBedIds, previewBed, placementBed);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [viewport, scheduleRender, scheduleRenderLegacy, beds, selectedBedIds, previewBed, previewBeds, placementBed, placementBeds, canvasRef]);

  // Render when viewport or beds change
  useEffect(() => {
    // Use new array-based rendering if available, otherwise fall back to legacy
    if (previewBeds || placementBeds) {
      const actualPreviewBeds = previewBeds || (previewBed ? [previewBed] : []);
      const actualPlacementBeds = placementBeds || (placementBed ? [placementBed] : []);
      scheduleRender(viewport, beds, selectedBedIds, actualPreviewBeds, actualPlacementBeds);
    } else {
      scheduleRenderLegacy(viewport, beds, selectedBedIds, previewBed, placementBed);
    }
  }, [viewport, beds, selectedBedIds, previewBed, previewBeds, placementBed, placementBeds, scheduleRender, scheduleRenderLegacy]);

  const getCursorStyle = () => {
    if (isCreating) return 'crosshair';
    if (tool === 'create-rectangle' || tool === 'create-circle') return 'crosshair';
    if (tool === 'select') return 'pointer';
    return 'grab';
  };

  // Enhanced pointer event handling
  const handlePointerDownWithLogging = (e: React.PointerEvent) => {
    console.log('CanvasContainer.pointerDown:', { 
      tool, 
      isCreating, 
      pointerType: e.pointerType,
      isPrimary: e.isPrimary 
    });
    
    // Only handle primary pointer events to avoid conflicts
    if (!e.isPrimary) return;
    
    handlePointerDown(e);
  };

  const handlePointerMoveWithLogging = (e: React.PointerEvent) => {
    // Only handle primary pointer events and when needed
    if (!e.isPrimary) return;
    
    // Only call move handler for creation tools or selection
    if (isCreating || tool === 'select') {
      handlePointerMove(e);
    }
  };

  const handlePointerUpWithLogging = (e: React.PointerEvent) => {
    console.log('CanvasContainer.pointerUp:', { tool, isCreating, pointerType: e.pointerType });
    
    // Only handle primary pointer events
    if (!e.isPrimary) return;
    
    handlePointerUp();
  };

  console.log('CanvasContainer render:', { tool, isCreating });

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ 
          touchAction: 'none',
          background: '#FAFAF9',
          cursor: getCursorStyle(),
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onPointerDown={handlePointerDownWithLogging}
        onPointerMove={handlePointerMoveWithLogging}
        onPointerUp={handlePointerUpWithLogging}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
