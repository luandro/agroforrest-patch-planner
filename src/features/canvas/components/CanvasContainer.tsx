
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
  previewBed: any;
  placementBed?: any;
  gridSize?: number;
  bedConfig?: any;
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
  gridSize = 1,
  bedConfig
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scheduleRender, canvasRef } = useCanvasRenderer({
    gridSize,
    spacing: bedConfig?.spacing || 0.4
  });

  // Handle gestures only when in pan mode or when not creating
  useCanvasGestures({
    onPan: (tool === 'pan' && !isCreating) ? pan : () => {},
    onZoom: (zoom) => zoomTo(zoom),
    canvasRef,
    currentZoom: viewport.zoom
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

      scheduleRender(viewport, beds, selectedBedIds, previewBed, placementBed);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [viewport, scheduleRender, beds, selectedBedIds, previewBed, placementBed, canvasRef]);

  // Render when viewport or beds change
  useEffect(() => {
    scheduleRender(viewport, beds, selectedBedIds, previewBed, placementBed);
  }, [viewport, beds, selectedBedIds, previewBed, placementBed, scheduleRender]);

  const getCursorStyle = () => {
    if (isCreating) return 'crosshair';
    if (tool === 'create-rectangle' || tool === 'create-circle') return 'crosshair';
    if (tool === 'select') return 'pointer';
    return 'grab';
  };

  return (
    <div 
      ref={containerRef} 
      className="touch-none select-none overscroll-none w-full h-full"
    >
      <canvas
        ref={canvasRef}
        className="block touch-none cursor-grab active:cursor-grabbing"
        style={{ 
          touchAction: 'none',
          background: '#FAFAF9',
          cursor: getCursorStyle()
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
