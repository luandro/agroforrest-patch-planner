
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface MobileFloatingZoomProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  bedsCount: number;
  className?: string;
}

export const MobileFloatingZoom: React.FC<MobileFloatingZoomProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitAll,
  bedsCount,
  className
}) => {
  return (
    <div className={cn(
      "fixed bottom-20 right-4 z-30 flex flex-col gap-2",
      className
    )}>
      {/* Zoom In */}
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        className="w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-green-50 hover:border-green-300 active:scale-95 rounded-full"
        aria-label="Aumentar zoom"
        title="Aumentar zoom"
      >
        <Plus className="w-5 h-5 text-green-600" />
      </Button>
      
      {/* Zoom Out */}
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        className="w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-red-50 hover:border-red-300 active:scale-95 rounded-full"
        aria-label="Diminuir zoom"
        title="Diminuir zoom"
      >
        <Minus className="w-5 h-5 text-red-600" />
      </Button>
      
      {/* Fit All */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFitAll}
        disabled={bedsCount === 0}
        className="w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-blue-50 hover:border-blue-300 active:scale-95 disabled:opacity-50 rounded-full"
        aria-label="Ver todos os canteiros"
        title="Ver todos os canteiros"
      >
        <span className="text-sm text-blue-600">📐</span>
      </Button>

      {/* Zoom Level Indicator */}
      <div className="text-xs text-gray-600 text-center px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm font-mono border border-gray-200">
        {zoom.toFixed(1)}x
      </div>
    </div>
  );
};
