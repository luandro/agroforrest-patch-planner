
import React from 'react';
import { CanvasContainer } from './CanvasContainer';
import { SideViewCanvas } from './SideViewCanvas';
import { DevelopmentInfo } from './DevelopmentInfo';
import { ViewModeToggle } from './ViewModeToggle';
import { useSideViewStore } from '../stores/sideViewStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { CanvasViewport as CanvasViewportState } from '../types/canvas.types';
import type { Bed, BedConfig, CanvasTool } from '../types/bed.types';
import type { ZoomToFn } from '../types/layout.types';

interface CanvasViewportProps {
  viewport: CanvasViewportState;
  beds: Bed[];
  selectedBedIds: string[];
  tool: CanvasTool;
  isCreating: boolean;
  previewBed: Bed | null;
  placementBed: Bed | null;
  previewBeds?: Bed[];
  placementBeds?: Bed[];
  hasCollision?: boolean;
  handlePointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: ZoomToFn;
  bedConfig: BedConfig;
  gridSize?: number;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  focusedBed?: Bed | null;
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
  if (import.meta.env.DEV) {
    console.debug("[CanvasViewport] focusedBed", focusedBed, "viewMode", viewMode);
  }

  return (
    <div className="relative w-full h-screen pt-16 overflow-hidden">
      {/* View Mode Toggle - Enhanced positioning with safe z-index */}
      <div className={cn(
        "absolute z-[200]",
        isMobile ? "top-2 left-2" : "top-4 left-4"
      )}>
        <ViewModeToggle />
      </div>

      {/* Conditional Canvas Rendering with smooth transitions */}
      <div className="w-full h-full transition-opacity duration-300 relative">
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
      </div>

      {/* Development Info - Positioned safely */}
      {import.meta.env.DEV && (
        <div className="absolute bottom-4 left-4 z-[50] max-w-xs">
          <DevelopmentInfo
            beds={beds}
            selectedBedIds={selectedBedIds}
            viewport={viewport}
            tool={tool}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
};
