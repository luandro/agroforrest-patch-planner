
import React from 'react';
import { CanvasContainer } from './CanvasContainer';
import { SideViewCanvas } from './SideViewCanvas';
import { DevelopmentInfo } from './DevelopmentInfo';
import { ViewModeToggle } from './ViewModeToggle';
import { useSideViewStore } from '../stores/sideViewStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface CanvasViewportProps {
  viewport: any;
  beds: any[];
  selectedBedIds: string[];
  tool: any;
  isCreating: boolean;
  previewBed: any;
  placementBed: any;
  previewBeds?: any[];
  placementBeds?: any[];
  hasCollision?: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
  bedConfig: any;
  gridSize?: number;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  focusedBed?: any;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  viewport,
  beds,
  selectedBedIds,
  tool,
  isCreating,
  previewBed,
  placementBed,
  previewBeds,
  placementBeds,
  hasCollision,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleDoubleClick,
  pan,
  zoomTo,
  bedConfig,
  gridSize = 1,
  canvasRef,
  focusedBed
}) => {
  const isMobile = useIsMobile();
  const { viewMode } = useSideViewStore();

  // DEBUG: Log focusedBed as received
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[CanvasViewport] focusedBed", focusedBed);
  }

  return (
    <div className="relative w-full h-screen pt-16">
      {/* View Mode Toggle */}
      <div className="absolute top-4 left-4 z-30">
        <ViewModeToggle />
      </div>

      {/* Conditional Canvas Rendering */}
      {viewMode === 'top' ? (
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
          previewBeds={previewBeds}
          placementBeds={placementBeds}
          hasCollision={hasCollision}
          gridSize={gridSize}
          bedConfig={bedConfig}
          canvasRef={canvasRef}
          focusedBed={focusedBed}
        />
      ) : (
        <SideViewCanvas 
          focusedBedId={focusedBed?.id}
          className="w-full h-full"
        />
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <DevelopmentInfo
          beds={beds}
          selectedBedIds={selectedBedIds}
          viewport={viewport}
          tool={tool}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};
