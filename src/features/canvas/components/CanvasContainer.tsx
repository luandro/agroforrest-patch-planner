
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
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  focusedBed?: any;
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
    spacing: bedConfig?.spacing || 0.4,
    focusedBed
  });

  // Enable gestures when in pan mode OR when not actively creating
  const gesturesEnabled = tool === 'pan' || !isCreating;
  console.log('Gestures enabled:', gesturesEnabled, 'tool:', tool, 'isCreating:', isCreating);

  // Handle gestures with proper enablement
  useCanvasGestures({
    onPan: pan,
    onZoom: (zoom) => zoomTo(zoom),
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
      className="w-full h-full"
      style={{ touchAction: gesturesEnabled ? 'none' : 'auto' }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{ 
          touchAction: gesturesEnabled ? 'none' : 'auto',
          background: '#FAFAF9',
          cursor: getCursorStyle(),
          userSelect: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};
