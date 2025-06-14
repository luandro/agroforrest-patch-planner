
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
  previewBed?: any;
  previewBeds?: any[];
  placementBed?: any;
  placementBeds?: any[];
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
  previewBeds,
  placementBed,
  placementBeds,
  gridSize = 1,
  cancelCreation,
  setTool,
  deleteSelected,
  isMobile = false,
  showDesktopSidebar = true
}) => {
  // Fix canvas positioning to ensure full access
  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    // Ensure pointer events work throughout the entire canvas
    pointerEvents: 'auto',
    touchAction: 'none'
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Canvas container with full accessibility */}
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
          previewBeds={previewBeds}
          placementBed={placementBed}
          placementBeds={placementBeds}
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
    </div>
  );
};
