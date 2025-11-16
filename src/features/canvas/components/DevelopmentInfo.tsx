
import React from 'react';
import { cn } from '@/lib/utils';
import { CanvasViewport } from '../types/canvas.types';
import { Bed, CanvasTool } from '../types/bed.types';

interface DevelopmentInfoProps {
  viewport: CanvasViewport;
  tool: CanvasTool;
  beds: Bed[];
  selectedBedIds: string[];
  isMobile: boolean;
}

export const DevelopmentInfo: React.FC<DevelopmentInfoProps> = ({
  viewport,
  tool,
  beds,
  selectedBedIds,
  isMobile
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={cn(
      "fixed bg-black/80 text-white text-xs p-2 rounded font-mono z-10",
      // Mobile: Position at bottom-left to avoid all UI conflicts
      isMobile 
        ? "bottom-4 left-4 max-w-[180px]" 
        : "bottom-4 left-4 max-w-[220px]",
      // Hide on very small screens to reduce clutter
      "hidden xs:block"
    )}>
      <div>Centro: ({viewport.centerX.toFixed(1)}m, {viewport.centerY.toFixed(1)}m)</div>
      <div>Zoom: {viewport.zoom.toFixed(2)}x</div>
      <div>Área: {viewport.width.toFixed(1)}×{viewport.height.toFixed(1)}m</div>
      <div>Ferramenta: {tool}</div>
      <div>Canteiros: {beds.length}</div>
      <div>Selecionados: {selectedBedIds.length}</div>
      {isMobile && <div>Mobile: Sim</div>}
    </div>
  );
};
