
import React, { useRef, useEffect } from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasViewport } from '../hooks/useCanvasViewport';
import { useCanvasGestures } from '../hooks/useCanvasGestures';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { CanvasControls } from './CanvasControls';
import { MiniMap } from './MiniMap';

export const PatchCanvas: React.FC<PatchCanvasProps> = ({
  initialViewport,
  onViewportChange,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { viewport, pan, zoomTo, updateViewport } = useCanvasViewport({
    initialViewport,
    minZoom,
    maxZoom,
    onViewportChange
  });

  const { scheduleRender, cleanup } = useCanvasRenderer({
    canvasRef,
    gridSize
  });

  // Handle gestures
  useCanvasGestures({
    onPan: pan,
    onZoom: (zoom) => zoomTo(zoom),
    canvasRef,
    currentZoom: viewport.zoom
  });

  // Handle zoom controls
  const handleZoomIn = () => {
    zoomTo(Math.min(maxZoom, viewport.zoom * 1.2));
  };

  const handleZoomOut = () => {
    zoomTo(Math.max(minZoom, viewport.zoom / 1.2));
  };

  const handleReset = () => {
    updateViewport({
      zoom: 1,
      centerX: 10,
      centerY: 10
    });
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const panStep = 2; // meters
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          pan(0, -50); // Pan up
          break;
        case 'ArrowDown':
          e.preventDefault();
          pan(0, 50); // Pan down
          break;
        case 'ArrowLeft':
          e.preventDefault();
          pan(-50, 0); // Pan left
          break;
        case 'ArrowRight':
          e.preventDefault();
          pan(50, 0); // Pan right
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pan]);

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

      scheduleRender(viewport);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [viewport, scheduleRender]);

  // Render when viewport changes
  useEffect(() => {
    scheduleRender(viewport);
  }, [viewport, scheduleRender]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <div ref={containerRef} className="w-full h-full">
        <canvas
          ref={canvasRef}
          className="block touch-none cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Controls */}
      <CanvasControls
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />

      {/* Mini Map */}
      <MiniMap viewport={viewport} />

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>Centro: ({viewport.centerX.toFixed(1)}m, {viewport.centerY.toFixed(1)}m)</div>
          <div>Zoom: {viewport.zoom.toFixed(2)}x</div>
          <div>Área: {viewport.width.toFixed(1)}×{viewport.height.toFixed(1)}m</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PatchCanvas);
