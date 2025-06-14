
import React from 'react';
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
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
      <div>Centro: ({viewport.centerX.toFixed(1)}m, {viewport.centerY.toFixed(1)}m)</div>
      <div>Zoom: {viewport.zoom.toFixed(2)}x</div>
      <div>Área: {viewport.width.toFixed(1)}×{viewport.height.toFixed(1)}m</div>
      <div>Ferramenta: {tool}</div>
      <div>Canteiros: {beds.length}</div>
      <div>Selecionados: {selectedBedIds.length}</div>
      <div>Mobile: {isMobile ? 'Sim' : 'Não'}</div>
    </div>
  );
};
