
import React, { useRef, useEffect, useState } from 'react';
import { PatchCanvasProps } from '../types/canvas.types';
import { useCanvasViewport } from '../hooks/useCanvasViewport';
import { useCanvasGestures } from '../hooks/useCanvasGestures';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { useBedCreation } from '../hooks/useBedCreation';
import { useBedSelection } from '../hooks/useBedSelection';
import { useAutoSave } from '../hooks/useAutoSave';
import { useBedStore } from '../stores/bedStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedMiniMap } from './EnhancedMiniMap';
import { MobileControls } from './MobileControls';
import { DesktopSidebar } from './DesktopSidebar';
import { BedRenderer } from './BedRenderer';
import { ViewControls } from './ViewControls';

export const PatchCanvas: React.FC<PatchCanvasProps> = ({
  initialViewport,
  onViewportChange,
  gridSize = 1,
  minZoom = 0.5,
  maxZoom = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);

  // Canvas viewport and rendering
  const { viewport, pan, zoomTo, updateViewport, centerOnBed, fitAllBeds } = useCanvasViewport({
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
    canRedo,
    isCreatingBed,
    setIsCreatingBed
  } = useBedStore();

  // Bed creation with auto-zoom
  const {
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    startCreation,
    updateCreation,
    finishCreation,
    cancelCreation
  } = useBedCreation({ 
    viewport, 
    gridSize, 
    onBedCreated: (bedId) => {
      // Auto-zoom to show 1m grid squares and center on new bed
      setTimeout(() => {
        centerOnBed(bedId, 2.0); // 2x zoom shows ~1m grid squares clearly
      }, 100);
    }
  });

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
      setIsCreatingBed(true);
      startCreation(x, y);
    } else if (tool === 'select') {
      const isMultiSelect = e.shiftKey || e.ctrlKey;
      startSelection(x, y, isMultiSelect);
    }

    // Auto-hide mobile controls after interaction
    if (isMobile && showMobileControls) {
      setTimeout(() => setShowMobileControls(false), 2000);
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
      setIsCreatingBed(false);
    } else {
      finishSelection();
    }
  };

  // Double tap for quick bed creation on mobile
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isMobile && tool === 'pan') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Switch to rectangle tool temporarily and create bed
      setTool('create-rectangle');
      setIsCreatingBed(true);
      startCreation(x, y);
      
      // Simulate drag to create default size bed
      setTimeout(() => {
        updateCreation(x + 50, y + 20); // Default 1m x 0.4m bed
        finishCreation();
        setIsCreatingBed(false);
        setTool('pan');
      }, 10);
    }
  };

  // Handle gestures only when in pan mode or when not creating
  useCanvasGestures({
    onPan: (tool === 'pan' && !isCreating) ? pan : () => {},
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

  const handleFitAll = () => {
    fitAllBeds(beds);
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
          handleFitAll();
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
            setIsCreatingBed(false);
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

  // Calculate canvas dimensions based on sidebar state
  const canvasStyle = {
    width: isMobile ? '100vw' : showDesktopSidebar ? 'calc(100vw - 300px)' : '100vw',
    height: 'calc(100vh - 4rem)', // Subtract header height
    position: 'fixed' as const,
    top: '4rem', // Header height
    left: 0,
    zIndex: 10
  };

  return (
    <>
      {/* Full-screen canvas container */}
      <div 
        ref={containerRef} 
        className="touch-none select-none overscroll-none"
        style={canvasStyle}
      >
        <canvas
          ref={canvasRef}
          className="block touch-none cursor-grab active:cursor-grabbing"
          style={{ 
            touchAction: 'none',
            background: '#FAFAF9',
            cursor: isCreating ? 'crosshair' : tool === 'select' ? 'pointer' : 'grab'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={handleDoubleClick}
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

      {/* Enhanced MiniMap - always visible */}
      <EnhancedMiniMap 
        viewport={viewport} 
        beds={beds}
        onNavigate={(x, y) => updateViewport({ centerX: x, centerY: y })}
        className="fixed top-20 left-4 z-50"
      />

      {/* View Controls - always visible in top-right */}
      <ViewControls
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitAll={handleFitAll}
        bedsCount={beds.length}
        className="fixed top-20 right-4 z-50"
      />

      {/* Mobile Controls */}
      {isMobile && (
        <MobileControls
          activeTool={tool}
          onToolChange={setTool}
          bedConfig={bedConfig}
          onBedConfigChange={updateBedConfig}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo()}
          canRedo={canRedo()}
          onDeleteSelected={deleteSelected}
          selectedCount={selectedBedIds.length}
          isVisible={showMobileControls}
          onToggle={setShowMobileControls}
          isSaving={isSaving}
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <DesktopSidebar
          activeTool={tool}
          onToolChange={setTool}
          bedConfig={bedConfig}
          onBedConfigChange={updateBedConfig}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo()}
          canRedo={canRedo()}
          onDeleteSelected={deleteSelected}
          selectedCount={selectedBedIds.length}
          isCollapsed={!showDesktopSidebar}
          onToggleCollapse={setShowDesktopSidebar}
          isSaving={isSaving}
          beds={beds}
          viewport={viewport}
        />
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
          <div>Centro: ({viewport.centerX.toFixed(1)}m, {viewport.centerY.toFixed(1)}m)</div>
          <div>Zoom: {viewport.zoom.toFixed(2)}x</div>
          <div>Área: {viewport.width.toFixed(1)}×{viewport.height.toFixed(1)}m</div>
          <div>Ferramenta: {tool}</div>
          <div>Canteiros: {beds.length}</div>
          <div>Selecionados: {selectedBedIds.length}</div>
          <div>Mobile: {isMobile ? 'Sim' : 'Não'}</div>
        </div>
      )}
    </>
  );
};

export default React.memo(PatchCanvas);
