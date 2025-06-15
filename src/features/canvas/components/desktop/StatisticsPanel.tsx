
import React from 'react';
import { Bed } from '../../types/bed.types';
import { CanvasViewport } from '../../types/canvas.types';

interface StatisticsPanelProps {
  beds: Bed[];
  selectedCount: number;
  viewport: CanvasViewport;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  beds,
  selectedCount,
  viewport
}) => {
  const totalArea = beds.reduce((total, bed) => {
    if (bed.shape === 'rectangle') {
      return total + ((bed.dimensions.length || 0) * (bed.dimensions.width || 0));
    } else {
      const radius = bed.dimensions.radius || 0;
      return total + (Math.PI * radius * radius);
    }
  }, 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Estatísticas</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total de Canteiros:</span>
          <span className="font-medium">{beds.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Selecionados:</span>
          <span className="font-medium">{selectedCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Área Total:</span>
          <span className="font-medium">{totalArea.toFixed(1)}m²</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Zoom:</span>
          <span className="font-medium">{viewport.zoom.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
};
