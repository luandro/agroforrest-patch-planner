
import React, { useRef, useEffect, useState } from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasViewport } from '../hooks/useCanvasViewport';
import { useCanvasGestures } from '../hooks/useCanvasGestures';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { useBedCreation } from '../hooks/useBedCreation';
import { useBedSelection } from '../hooks/useBedSelection';
import { useAutoSave } from '../hooks/useAutoSave';
import { useBedStore } from '../stores/bedStore';
import { CanvasControls } from './CanvasControls';
import { MiniMap } from './MiniMap';
import { BedConfigPanel } from './BedConfigPanel';
import { CanvasToolbar } from './CanvasToolbar';
import { BedRenderer } from './BedRenderer';

export const PatchCanvas: React.FC<PatchCanvasProps> = ({
  initialViewport,
  onViewportChange,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Canvas viewport and rendering
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

  // Bed management
  const { 
    tool, 
    setTool, 
    beds, 
    selectedBedIds,
    undo,
    redo,
    canUndo,
    canRedo
  } = useBedStore();

  // Bed creation
  const {
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    startCreation,
    updateCreation,
    finishCreation,
    cancelCreation
  } = useBedCreation({ viewport, gridSize });

  // Bed selection
  const {
    startSelection,
    updateSelection,
    finishSelection,
    deleteSelected
  } = useBedSelection({ viewport });

  // Auto-save
  const { isSaving } = useAutoSave();

  // Handle canvas interactions based on current tool
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'create-rectangle' || tool === 'create-circle') {
      startCreation(x, y);
    } else if (tool === 'select') {
      const isMultiSelect = e.shiftKey || e.ctrlKey;
      startSelection(x, y, isMultiSelect);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCreating) {
      updateCreation(x, y);
    } else {
      updateSelection(x, y);
    }
  };

  const handlePointerUp = () => {
    if (isCreating) {
      finishCreation();
    } else {
      finishSelection();
    }
  };

  // Handle gestures only when in pan mode
  useCanvasGestures({
    onPan: tool === 'pan' ? pan : () => {},
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
      // Prevent default for our handled keys
      const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '=', '-', '0', 'Delete', 'Backspace'];
      if (handledKeys.includes(e.key) || (e.ctrlKey && (e.key === 'z' || e.key === 'Z'))) {
        e.preventDefault();
      }

      const panStep = 2; // meters
      
      switch (e.key) {
        case 'ArrowUp':
          pan(0, -50);
          break;
        case 'ArrowDown':
          pan(0, 50);
          break;
        case 'ArrowLeft':
          pan(-50, 0);
          break;
        case 'ArrowRight':
          pan(50, 0);
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleReset();
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedBedIds.length > 0) {
            deleteSelected();
          }
          break;
        case 'z':
        case 'Z':
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;
        case 'Escape':
          if (isCreating) {
            cancelCreation();
          }
          setTool('pan');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pan, isCreating, selectedBedIds]);

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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>

      {/* Render beds on canvas */}
      <BedRenderer
        beds={beds}
        selectedBedIds={selectedBedIds}
        viewport={viewport}
        previewBed={previewBed}
        canvasRef={canvasRef}
      />

      {/* Canvas Controls */}
      <CanvasControls
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />

      {/* Mini Map */}
      <MiniMap viewport={viewport} />

      {/* Toolbar */}
      <CanvasToolbar
        activeTool={tool}
        onToolChange={setTool}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo()}
        canRedo={canRedo()}
        onToggleConfig={() => setShowConfigPanel(!showConfigPanel)}
        isSaving={isSaving}
      />

      {/* Configuration Panel */}
      {showConfigPanel && (
        <BedConfigPanel
          config={bedConfig}
          onConfigChange={updateBedConfig}
          onClose={() => setShowConfigPanel(false)}
        />
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>Centro: ({viewport.centerX.toFixed(1)}m, {viewport.centerY.toFixed(1)}m)</div>
          <div>Zoom: {viewport.zoom.toFixed(2)}x</div>
          <div>Área: {viewport.width.toFixed(1)}×{viewport.height.toFixed(1)}m</div>
          <div>Ferramenta: {tool}</div>
          <div>Canteiros: {beds.length}</div>
          <div>Selecionados: {selectedBedIds.length}</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PatchCanvas);
