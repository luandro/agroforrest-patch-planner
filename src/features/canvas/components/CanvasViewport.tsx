
import React from 'react';
import { CanvasContainer } from './CanvasContainer';
import { CanvasKeyboardHandler } from './CanvasKeyboardHandler';
import { CanvasTool } from '../types/bed.types';

interface CanvasViewportProps {
  viewport: any;
  tool: CanvasTool;
  isCreating: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitAll: () => void;
  beds: any[];
  selectedBedIds: string[];
  previewBed: any;
  placementBed: any;
  gridSize?: number;
  cancelCreation: () => void;
  setTool: (tool: CanvasTool) => void;
  deleteSelected: () => void;
  isMobile?: boolean;
  showDesktopSidebar?: boolean;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  viewport,
  tool,
  isCreating,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleDoubleClick,
  pan,
  zoomTo,
  handleZoomIn,
  handleZoomOut,
  handleFitAll,
  beds,
  selectedBedIds,
  previewBed,
  placementBed,
  gridSize = 1,
  cancelCreation,
  setTool,
  deleteSelected,
  isMobile = false,
  showDesktopSidebar = true
}) => {
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
      <div style={canvasStyle}>
        <CanvasContainer
          viewport={viewport}
          tool={tool}
          isCreating={isCreating}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
          handleDoubleClick={handleDoubleClick}
          pan={pan}
          zoomTo={zoomTo}
          beds={beds}
          selectedBedIds={selectedBedIds}
          previewBed={previewBed}
          placementBed={placementBed}
          gridSize={gridSize}
        />
      </div>

      {/* Keyboard Handler */}
      <CanvasKeyboardHandler
        pan={pan}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleFitAll={handleFitAll}
        isCreating={isCreating}
        cancelCreation={cancelCreation}
        setTool={setTool}
        selectedBedIds={selectedBedIds}
        deleteSelected={deleteSelected}
      />
    </>
  );
};
