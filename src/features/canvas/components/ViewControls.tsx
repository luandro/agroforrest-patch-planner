
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  bedsCount: number;
  className?: string;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitAll,
  bedsCount,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200",
      className
    )}>
      {/* Zoom Level Indicator */}
      <div className="text-xs text-gray-600 text-center px-2 py-1 bg-gray-50 rounded">
        {zoom.toFixed(1)}x
      </div>
      
      {/* Zoom In */}
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        className="w-10 h-10 p-0 touch-manipulation hover:bg-green-50 hover:border-green-300"
        aria-label="Aumentar zoom"
        title="Aumentar zoom"
      >
        <span className="text-lg font-bold text-green-600">+</span>
      </Button>
      
      {/* Zoom Out */}
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        className="w-10 h-10 p-0 touch-manipulation hover:bg-red-50 hover:border-red-300"
        aria-label="Diminuir zoom"
        title="Diminuir zoom"
      >
        <span className="text-lg font-bold text-red-600">−</span>
      </Button>
      
      {/* Fit All Beds */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFitAll}
        disabled={bedsCount === 0}
        className="w-10 h-10 p-0 text-xs touch-manipulation hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
        aria-label="Ajustar visualização para todos os canteiros"
        title="Ver todos os canteiros"
      >
        <span className="text-blue-600">📐</span>
      </Button>
    </div>
  );
};
