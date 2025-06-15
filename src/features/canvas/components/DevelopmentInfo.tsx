
import React from 'react';
import { cn } from '@/lib/utils';
import { CanvasViewport } from '../types/canvas.types';

interface DevelopmentInfoProps {
  viewport: CanvasViewport;
  tool: string;
  beds: any[];
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
      "fixed bg-black/80 text-white text-xs p-2 rounded font-mono z-20",
      // Mobile-friendly positioning that doesn't overlap controls
      isMobile ? "top-20 left-2 max-w-[200px]" : "bottom-4 left-4",
      // Hide on small mobile screens to avoid clutter
      "hidden sm:block"
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
